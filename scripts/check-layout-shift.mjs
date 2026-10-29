// Fails CI when a built page moves content that is already on screen.
// Run after `pnpm build`.
//
// Each page loads in a phone-sized Chromium on a slowed network, so the
// browser paints before deferred scripts run and before fonts and images
// arrive, as on a phone. A script that rewrites text after paint, an image
// without dimensions, or a font swap that rewraps a line all show up as
// layout-shift entries. The check also navigates between pages with
// ClientRouter, where the new page's scripts can load after the swap.
/* global window, document, performance, PerformanceObserver, MutationObserver */
import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { URL } from "node:url";
import console from "node:console";
import process from "node:process";
import { chromium, devices } from "playwright";

const DIST = "dist";
const DEVICE = devices["Pixel 7"];
const NETWORK = {
  offline: false,
  latency: 150,
  downloadThroughput: 1_600_000,
  uploadThroughput: 750_000,
};
// Time after load for late scripts, fonts and images to land
const SETTLE_MS = 1500;
// Pages to start ClientRouter navigations from. Each has a different set of
// scripts, so a target page's scripts are new to at least one of them.
const NAVIGATION_STARTS = ["/", "/about", "/posts"];
const CONCURRENCY = 4;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

// Serves `about.html` at `/about`, as Cloudflare does with `build.format: "file"`
async function resolveFile(pathname) {
  const path = join(DIST, decodeURIComponent(pathname));
  if (!path.startsWith(DIST)) return null;
  if (pathname === "/") return join(DIST, "index.html");
  if (await isFile(`${path}.html`)) return `${path}.html`;
  if (await isFile(path)) return path;
  return null;
}

function startServer() {
  const server = createServer(async (req, res) => {
    const file = await resolveFile(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!file) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "content-type":
        CONTENT_TYPES[extname(file)] ?? "application/octet-stream",
    });
    res.end(await readFile(file));
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server)),
  );
}

async function listPages() {
  const pages = [];
  for await (const path of walk(DIST)) {
    if (extname(path) !== ".html") continue;
    const page =
      "/" +
      relative(DIST, path)
        .split(sep)
        .join("/")
        .replace(/\.html$/, "");
    if (page === "/404") continue;
    pages.push(page === "/index" ? "/" : page);
  }
  return pages.sort();
}

function recordLayoutShifts() {
  window.__layoutShifts = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__layoutShifts.push({
        value: entry.value,
        startTime: entry.startTime,
        hadRecentInput: entry.hadRecentInput,
        sources: entry.sources.map((source) => {
          const node = source.node;
          if (!node) return "(removed node)";
          const name =
            node.nodeName.toLowerCase() +
            (node.className
              ? `.${String(node.className).trim().split(/\s+/).join(".")}`
              : "");
          const text = (node.textContent ?? "")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 40);
          const { previousRect: a, currentRect: b } = source;
          return `${name} "${text}" moved (${a.x},${a.y} ${a.width}x${a.height}) -> (${b.x},${b.y} ${b.width}x${b.height})`;
        }),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });

  // Text replaced in place moves nothing, so layout-shift misses it. The
  // parser only appends nodes, so a removal or text edit is a script.
  window.__rewrites = [];
  const IGNORED = new Set(["SCRIPT", "STYLE", "LINK", "TEMPLATE", "#comment"]);
  new MutationObserver((records) => {
    for (const record of records) {
      const target =
        record.target.nodeType === 1
          ? record.target
          : record.target.parentElement;
      if (
        !target ||
        IGNORED.has(target.nodeName) ||
        !target.getClientRects().length
      )
        continue;
      const removed = [...record.removedNodes].filter(
        (n) => !IGNORED.has(n.nodeName),
      );
      if (record.type === "childList" && !removed.length) continue;
      const before =
        record.type === "characterData"
          ? record.oldValue
          : removed.map((n) => n.textContent).join("");
      const after =
        record.type === "characterData"
          ? record.target.data
          : [...record.addedNodes].map((n) => n.textContent).join("");
      if (before.trim() === after.trim()) continue;
      window.__rewrites.push({
        time: performance.now(),
        description: `${target.nodeName.toLowerCase()} "${before.trim().slice(0, 40)}" -> "${after.trim().slice(0, 40)}"`,
      });
    }
  }).observe(document, {
    childList: true,
    characterData: true,
    characterDataOldValue: true,
    subtree: true,
  });
}

// Rewrites of on-screen text after `since`, or after the first paint
async function rewritesAfter(page, since) {
  return page.evaluate((since) => {
    const paint = performance.getEntriesByName("first-paint")[0];
    const start = since ?? paint?.startTime ?? 0;
    return window.__rewrites
      .filter((r) => r.time > start)
      .map(
        (r) => `  text rewritten at ${Math.round(r.time)}ms: ${r.description}`,
      );
  }, since);
}

async function openPage(browser) {
  const context = await browser.newContext({ ...DEVICE });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.emulateNetworkConditions", NETWORK);
  await page.addInitScript(recordLayoutShifts);
  return { context, page };
}

function describe(shifts) {
  return shifts
    .map(
      (s) =>
        `  ${s.value.toFixed(4)} at ${Math.round(s.startTime)}ms\n${s.sources.map((x) => `    ${x}`).join("\n")}`,
    )
    .join("\n");
}

async function checkLoad(browser, origin, path) {
  const { context, page } = await openPage(browser);
  try {
    await page.goto(origin + path, { waitUntil: "load" });
    await page.waitForTimeout(SETTLE_MS);
    const shifts = (await page.evaluate(() => window.__layoutShifts)).filter(
      (s) => !s.hadRecentInput,
    );
    const rewrites = await rewritesAfter(page);
    return shifts.length || rewrites.length
      ? `Load ${path}:\n${[describe(shifts), ...rewrites].filter(Boolean).join("\n")}`
      : null;
  } finally {
    await context.close();
  }
}

async function checkNavigation(browser, origin, from, to) {
  const { context, page } = await openPage(browser);
  try {
    await page.goto(origin + from, { waitUntil: "load" });
    await page.waitForTimeout(SETTLE_MS);
    await page.evaluate((href) => {
      document.addEventListener(
        "astro:after-swap",
        () => {
          window.__swappedAt = performance.now();
          // after-swap handlers run before this frame paints; record when it does
          window.requestAnimationFrame(
            () => (window.__swapPaintedAt = performance.now()),
          );
        },
        { once: true },
      );
      document.addEventListener(
        "astro:page-load",
        () => (window.__loadedAt = performance.now()),
      );
      window.__loadedAt = undefined;
      // ClientRouter handles clicks on any same-origin link
      const link = document.createElement("a");
      link.href = href;
      link.textContent = "layout shift check";
      link.style.cssText = "position:fixed;top:0;left:0;z-index:99999";
      document.body.append(link);
    }, to);
    await page.click("text=layout shift check");
    await page.waitForFunction(() => window.__loadedAt !== undefined, null, {
      timeout: 15000,
    });
    await page.waitForTimeout(SETTLE_MS);
    const { swappedAt, paintedAt, shifts } = await page.evaluate(() => ({
      swappedAt: window.__swappedAt,
      paintedAt: window.__swapPaintedAt,
      shifts: window.__layoutShifts,
    }));
    if (swappedAt === undefined)
      return `Navigate ${from} -> ${to}: ClientRouter did a full page load`;
    // The click marks every shift as recent input, so count all shifts after the swap
    const after = shifts.filter((s) => s.startTime >= swappedAt);
    const rewrites = await rewritesAfter(page, paintedAt);
    return after.length || rewrites.length
      ? `Navigate ${from} -> ${to}:\n${[describe(after), ...rewrites].filter(Boolean).join("\n")}`
      : null;
  } finally {
    await context.close();
  }
}

async function runAll(tasks) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < tasks.length) results.push(await tasks[next++]());
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

const server = await startServer();
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();

const pages = await listPages();
const tasks = [
  ...pages.map((path) => () => checkLoad(browser, origin, path)),
  ...NAVIGATION_STARTS.flatMap((from) =>
    pages
      .filter((to) => to !== from)
      .map((to) => () => checkNavigation(browser, origin, from, to)),
  ),
];

let errors;
try {
  errors = (await runAll(tasks)).filter(Boolean);
} finally {
  await browser.close();
  server.close();
}

console.log(
  `Checked ${pages.length} page loads and ${tasks.length - pages.length} navigations for layout shift.`,
);
if (errors.length) {
  console.error(errors.join("\n\n"));
  process.exit(1);
}
