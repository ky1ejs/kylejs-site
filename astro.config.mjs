import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import hastHeadingIds from "./src/lib/hast-heading-ids.ts";
import hastCallouts from "./src/lib/hast-callouts.ts";
import hastMermaidBlocks from "./src/lib/hast-mermaid-blocks.ts";
import hastFootnoteRefSeparators from "./src/lib/hast-footnote-ref-separators.ts";
import hastHeadingMarks from "./src/lib/hast-heading-marks.ts";
import hastHeadingLinks from "./src/lib/hast-heading-links.ts";

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
  image: {
    // Sharp encoder defaults; a per-image `quality` prop overrides these.
    // Higher effort trades build time for smaller files at the same quality.
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        avif: { quality: 55, effort: 4 },
        webp: { quality: 78, effort: 5 },
        jpeg: { quality: 80, mozjpeg: true },
      },
    },
  },
  markdown: {
    // Sätteri applies GFM and smart punctuation by default
    processor: satteri({
      hastPlugins: [
        hastHeadingIds,
        hastHeadingMarks,
        hastHeadingLinks,
        hastCallouts,
        hastMermaidBlocks,
        hastFootnoteRefSeparators,
      ],
      features: {
        gfm: { footnotes: { label: "References" } },
      },
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
