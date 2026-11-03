// Serves the built site for the browser checks. Run after `pnpm build`.
import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { URL } from "node:url";

const DIST = "dist";

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

// Cache headers as Cloudflare sends them: HTML is revalidated on every use,
// hashed `/_astro/` files are kept for a year (`public/_headers`)
function cacheControl(file) {
  return relative(DIST, file).startsWith(`_astro${sep}`)
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";
}

/** Starts a server for `dist/` on a free port and resolves to its origin. */
export function startServer() {
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
      "cache-control": cacheControl(file),
    });
    res.end(await readFile(file));
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () =>
      resolve({
        origin: `http://127.0.0.1:${server.address().port}`,
        close: () => server.close(),
      }),
    ),
  );
}

/** Public paths of the built pages, such as `/` and `/about`, without 404. */
export async function listPages() {
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
