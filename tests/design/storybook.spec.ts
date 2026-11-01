import { existsSync, readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Every story in the built Storybook, from its index
interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: "story" | "docs";
}

const index = JSON.parse(readFileSync("storybook-static/index.json", "utf8")) as {
  entries: Record<string, IndexEntry>;
};
const stories = Object.values(index.entries).filter((e) => e.type === "story");

async function openStory(page: Page, id: string, theme: "light" | "dark" | "both") {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.locator("#storybook-root > *").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
}

for (const story of stories) {
  test.describe(`${story.title} / ${story.name}`, () => {
    // One theme at a time: with both, ids and landmarks would appear twice
    for (const theme of ["light", "dark"] as const) {
      test(`has no WCAG A or AA violations in ${theme}`, async ({ page }) => {
        await openStory(page, story.id, theme);
        const results = await new AxeBuilder({ page })
          .include("#storybook-root")
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
      });
    }

    for (const width of [1280, 390]) {
      test(`matches its screenshot at ${width}px`, async ({ page }, testInfo) => {
        const name = `${story.id}-${width}.png`;
        const updating = testInfo.config.updateSnapshots !== "none";
        // Reference images are rendered on CI's Linux image; fonts render
        // differently elsewhere, so other platforms only run the axe checks
        test.skip(!updating && process.platform !== "linux", "Screenshots are compared on Linux only");
        // Without a reference image there is nothing to compare, unless this run creates one
        test.skip(!updating && !existsSync(testInfo.snapshotPath(name)), `No reference image yet: ${name}`);
        await page.setViewportSize({ width, height: 800 });
        await openStory(page, story.id, "both");
        await expect(page).toHaveScreenshot(name, { fullPage: true });
      });
    }
  });
}
