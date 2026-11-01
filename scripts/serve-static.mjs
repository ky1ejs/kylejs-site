// Serves a built directory over HTTP for the Playwright tests.
// Usage: node scripts/serve-static.mjs <dir> <port>
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import console from "node:console";
import process from "node:process";
import { URL } from "node:url";

const [dir = "storybook-static", port = "6006"] = process.argv.slice(2);
const root = normalize(dir) + sep;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  let path;
  try {
    path = normalize(join(root, decodeURIComponent(pathname)));
  } catch {
    // Malformed percent-encoding: decodeURIComponent throws URIError
    res.writeHead(400).end();
    return;
  }
  if (!path.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
}).listen(Number(port), () => console.log(`Serving ${dir} on http://localhost:${port}`));
