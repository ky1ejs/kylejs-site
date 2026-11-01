import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { calloutTextColors, status, textPairs, themes, type ThemeColors, type ThemeName } from "./tokens";

// WCAG 2.x relative luminance and contrast ratio
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const AA = 4.5;
const themeNames = Object.keys(themes) as ThemeName[];

describe("text contrast meets WCAG AA (4.5:1)", () => {
  for (const theme of themeNames) {
    for (const [fg, bg] of textPairs) {
      it(`${theme}: ${fg} on ${bg}`, () => {
        expect(contrast(themes[theme][fg], themes[theme][bg])).toBeGreaterThanOrEqual(AA);
      });
    }

    for (const [name, { fg, bg }] of Object.entries(status[theme])) {
      it(`${theme}: ${name} callout label on its background`, () => {
        expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA);
      });
      for (const color of calloutTextColors) {
        it(`${theme}: ${color} on the ${name} callout background`, () => {
          expect(contrast(themes[theme][color], bg)).toBeGreaterThanOrEqual(AA);
        });
      }
    }
  }
});

describe("tokens.css matches tokens.ts", () => {
  const css = readFileSync(fileURLToPath(new URL("./tokens.css", import.meta.url)), "utf8");

  // The first block whose selector list includes the theme's selector
  function block(selector: string): Record<string, string> {
    const start = css.indexOf(selector);
    if (start < 0) throw new Error(`tokens.css has no ${selector} block`);
    const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
    return Object.fromEntries(
      [...body.matchAll(/(--ks-[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, k, v]) => [k, v.toUpperCase()]),
    );
  }

  const cssName = (key: keyof ThemeColors) =>
    `--ks-${key.replace(/([A-Z])/g, "-$1").replace(/(\d)/, "-$1").toLowerCase()}`;

  const selectors: Record<ThemeName, string> = {
    light: '[data-theme="light"]',
    dark: '[data-theme="dark"] {',
  };

  for (const theme of themeNames) {
    it(`${theme} colours`, () => {
      const declared = block(selectors[theme]);
      for (const key of Object.keys(themes[theme]) as Array<keyof ThemeColors>) {
        expect(declared[cssName(key)], cssName(key)).toBe(themes[theme][key].toUpperCase());
      }
      for (const [name, { fg, bg }] of Object.entries(status[theme])) {
        expect(declared[`--ks-${name}-fg`]).toBe(fg.toUpperCase());
        expect(declared[`--ks-${name}-bg`]).toBe(bg.toUpperCase());
      }
      // And nothing in tokens.css that tokens.ts doesn't know about
      const expected = [
        ...(Object.keys(themes[theme]) as Array<keyof ThemeColors>).map(cssName),
        ...Object.keys(status[theme]).flatMap((name) => [`--ks-${name}-fg`, `--ks-${name}-bg`]),
      ];
      expect(Object.keys(declared).sort()).toEqual(expected.sort());
    });
  }

  it("the no-JavaScript dark fallback matches the dark theme", () => {
    expect(block(":root:not([data-theme])")).toEqual(block(selectors.dark));
  });
});
