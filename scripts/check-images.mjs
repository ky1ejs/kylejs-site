// Fails CI when an image would ship without going through astro:assets.
// Run after `pnpm build`.
import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import console from "node:console";
import process from "node:process";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|heic|tiff?)$/i;
// Per-file budget for built images. A 1472px AVIF/WebP photo sits well under this.
const MAX_BYTES = 400 * 1024;
// Images allowed in public/, which Astro copies without processing
const PUBLIC_ALLOWLIST = new Set([]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const errors = [];

for await (const path of walk("public")) {
  const rel = relative("public", path);
  if (IMAGE_EXT.test(path) && !PUBLIC_ALLOWLIST.has(rel)) {
    errors.push(`public/${rel}: images in public/ skip optimization. Move it to src/assets/ and use <Image>.`);
  }
}

let count = 0;
let total = 0;
for await (const path of walk("dist")) {
  if (!IMAGE_EXT.test(path)) continue;
  const { size } = await stat(path);
  count++;
  total += size;
  if (size > MAX_BYTES) {
    errors.push(`${path}: ${(size / 1024).toFixed(0)} KB exceeds the ${MAX_BYTES / 1024} KB budget.`);
  }
}

console.log(`Checked ${count} built images, ${(total / 1024).toFixed(0)} KB total.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
