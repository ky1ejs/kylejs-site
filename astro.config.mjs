import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import hastHeadingIds from "./src/lib/hast-heading-ids.ts";
import hastCallouts from "./src/lib/hast-callouts.ts";
import hastMermaidBlocks from "./src/lib/hast-mermaid-blocks.ts";

export default defineConfig({
  site: "https://kylejs.me",
  output: "static",
  // Pages build to `about.html` rather than `about/index.html`, so Cloudflare
  // serves them at `/about` without a trailing-slash redirect
  trailingSlash: "never",
  build: {
    format: "file",
  },
  // PageLoader prefetches into an in-memory cache instead
  prefetch: false,
  markdown: {
    // Sätteri applies GFM and smart punctuation by default
    processor: satteri({
      hastPlugins: [hastHeadingIds, hastCallouts, hastMermaidBlocks],
    }),
    syntaxHighlight: {
      type: "shiki",
      // Rendered as diagrams by hast-mermaid-blocks instead
      excludeLangs: ["mermaid"],
    },
  },
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
