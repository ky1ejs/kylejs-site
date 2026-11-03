// Fails CI when going back or forward to a page the reader has already seen
// shows the loading skeleton. Run after `pnpm build`.
//
// PageLoader serves ClientRouter navigations from an in-memory page cache
// and shows a skeleton when a page is not ready 100ms after a click. A page
// the reader has seen should come from that cache, including the one they
// first landed on. Each journey lands on a page in a phone-sized Chromium on
// a slowed network, follows a link, then goes back and forward through
// history: once right after the swap, and once after a pause.
/* global window, document, history, MutationObserver */
import console from "node:console";
import process from "node:process";
import { URL } from "node:url";
import { chromium, devices } from "playwright";
import { startServer } from "./dist-server.mjs";

const DEVICE = devices["Pixel 7"];
const NETWORK = {
  offline: false,
  latency: 150,
  downloadThroughput: 1_600_000,
  uploadThroughput: 750_000,
};
// Time after load for late scripts, fonts and images to land
const SETTLE_MS = 1500;
// Where each journey lands, and the page it then opens
const JOURNEYS = [
  ["/", "/about"],
  ["/", "/posts"],
  ["/about", "/posts"],
  ["/posts", "/"],
];
// Time on the second page before going back: none, and a reader's pause
const PAUSES_MS = [0, 3000];

// Records each skeleton PageLoader shows, with the URL it was shown for
function recordSkeletons() {
  window.__skeletons = [];
  window.__pageLoads = 0;
  document.addEventListener("astro:page-load", () => window.__pageLoads++);
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === 1 && node.getAttribute("aria-busy") === "true") {
          window.__skeletons.push(window.location.pathname);
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });
}

// Runs `step` in the page and waits for the ClientRouter navigation it starts
async function navigate(page, step, arg) {
  const loads = await page.evaluate(() => window.__pageLoads);
  await page.evaluate(step, arg);
  await page.waitForFunction((n) => window.__pageLoads > n, loads, {
    timeout: 15000,
  });
}

function follow(href) {
  // ClientRouter handles clicks on any same-origin link
  const link = document.createElement("a");
  link.href = href;
  link.textContent = "back navigation check";
  link.style.cssText = "position:fixed;top:0;left:0;z-index:99999";
  document.body.append(link);
  link.click();
}

async function checkJourney(browser, origin, from, to, pauseMs) {
  const context = await browser.newContext({ ...DEVICE });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.emulateNetworkConditions", NETWORK);
  await page.addInitScript(recordSkeletons);
  const htmlRequests = [];
  page.on("request", (request) => {
    if (["document", "fetch"].includes(request.resourceType())) {
      htmlRequests.push(new URL(request.url()).pathname);
    }
  });
  const name = `${from} -> ${to} -> back -> forward, ${pauseMs}ms on ${to}`;
  try {
    await page.goto(origin + from, { waitUntil: "load" });
    await page.waitForTimeout(SETTLE_MS);
    await navigate(page, follow, to);
    // Skeletons before this point are for a page not seen yet, which is fine
    const seen = await page.evaluate(() => window.__skeletons.length);
    await page.waitForTimeout(pauseMs);
    await navigate(page, () => history.back());
    await navigate(page, () => history.forward());
    // A skeleton is removed after the swap; give a late one time to appear
    await page.waitForTimeout(300);
    const skeletons = (await page.evaluate(() => window.__skeletons)).slice(
      seen,
    );
    console.log(`${name}: requested ${htmlRequests.join(", ")}`);
    return skeletons.length
      ? `${name}: showed a skeleton for ${skeletons.join(", ")}`
      : null;
  } finally {
    await context.close();
  }
}

const server = await startServer();
const browser = await chromium.launch();

// One at a time, so a busy CI machine does not delay a cached page past the
// skeleton's 100ms
const errors = [];
try {
  for (const [from, to] of JOURNEYS) {
    for (const pause of PAUSES_MS) {
      const error = await checkJourney(browser, server.origin, from, to, pause);
      if (error) errors.push(error);
    }
  }
} finally {
  await browser.close();
  server.close();
}

console.log(
  `Checked ${JOURNEYS.length * PAUSES_MS.length} back and forward navigations for skeletons.`,
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
