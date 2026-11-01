import { defineConfig } from "vitest/config";

// Unit tests for the design system. Kept apart from astro.config.mjs so the
// tests don't load Astro, Tailwind or the Markdown pipeline.
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
