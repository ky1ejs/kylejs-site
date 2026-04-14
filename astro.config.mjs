import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import rehypeHeadingIds from "./src/lib/rehype-heading-ids.ts";
import rehypeCallouts from "./src/lib/rehype-callouts.ts";
import rehypeMermaidBlocks from "./src/lib/rehype-mermaid-blocks.ts";

export default defineConfig({
  site: "https://kylejs.me",
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHeadingIds, rehypeCallouts, rehypeMermaidBlocks],
  },
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
