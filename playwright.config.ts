import { defineConfig, devices } from "@playwright/test";

// Accessibility and screenshot tests against the built Storybook.
// Run `pnpm build-storybook` first; CI does this in design-system.yaml.
export default defineConfig({
  testDir: "tests/design",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // Screenshots are compared only once reference images exist; see
  // tests/design/README.md for how to create or update them
  updateSnapshots: "none",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: "disabled" },
  },
  use: {
    baseURL: "http://localhost:6006",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "node scripts/serve-static.mjs storybook-static 6006",
    url: "http://localhost:6006/index.json",
    reuseExistingServer: !process.env.CI,
  },
});
