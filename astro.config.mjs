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
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
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
