// Design tokens: the source of truth for colour, type, space and radius.
//
// `tokens.css` declares the same values as CSS custom properties, and
// `tokens.test.ts` fails if the two drift apart or if a text colour drops
// below WCAG AA contrast against the background it is used on.

export type ThemeName = "light" | "dark";

export interface ThemeColors {
  /** Page background */
  paper: string;
  /** Cards, bands, code blocks */
  surface: string;
  /** Headings and body text */
  ink: string;
  /** Standfirsts and secondary copy */
  ink2: string;
  /** Metadata and captions */
  muted: string;
  /** Dividers and borders */
  rule: string;
  /** Marks, fills, focus ring */
  accent: string;
  /** Links, bold text, post titles */
  accentText: string;
  /** h2 highlighter, inline code, mark fill */
  accentSoft: string;
  /** Text on accent soft */
  onSoft: string;
  /** Text on an accent text fill (primary button) */
  onAccent: string;
  /** Primary button hover */
  accentHover: string;
}

export type StatusName = "note" | "tip" | "warning" | "caution";

export interface StatusColors {
  fg: string;
  bg: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    paper: "#F3F5F8",
    surface: "#FFFFFF",
    ink: "#12141A",
    ink2: "#4A5160",
    muted: "#5F6776",
    rule: "#DDE2E8",
    accent: "#8319E6",
    accentText: "#6914B8",
    accentSoft: "#F1E8FB",
    onSoft: "#4F0F8A",
    onAccent: "#FFFFFF",
    accentHover: "#4F0F8A",
  },
  dark: {
    paper: "#121318",
    surface: "#1C1D23",
    ink: "#ECEDF1",
    ink2: "#B4BAC6",
    muted: "#8E95A3",
    rule: "#2C2E36",
    accent: "#B575F0",
    accentText: "#CDA3F5",
    accentSoft: "#2A1E3D",
    onSoft: "#F3E8FC",
    onAccent: "#121318",
    accentHover: "#E6D1FA",
  },
};

export const status: Record<ThemeName, Record<StatusName, StatusColors>> = {
  light: {
    note: { fg: "#4F0F8A", bg: "#F1E8FB" },
    tip: { fg: "#1E6B3F", bg: "#E6F4EC" },
    warning: { fg: "#7A5200", bg: "#FBF1D6" },
    caution: { fg: "#A3261B", bg: "#FBE9E7" },
  },
  dark: {
    note: { fg: "#E6D1FA", bg: "#2A1E3D" },
    tip: { fg: "#8FD3A8", bg: "#15291E" },
    warning: { fg: "#E8C46A", bg: "#2B2314" },
    caution: { fg: "#F2A49B", bg: "#2E1715" },
  },
};

/** Text-on-background pairs the components use. Each must reach 4.5:1. */
export const textPairs: Array<[fg: keyof ThemeColors, bg: keyof ThemeColors]> = [
  ["ink", "paper"],
  ["ink", "surface"],
  ["ink2", "paper"],
  ["ink2", "surface"],
  ["muted", "paper"],
  ["muted", "surface"],
  ["accent", "paper"],
  ["accentText", "paper"],
  ["accentText", "surface"],
  ["onSoft", "accentSoft"],
  ["onAccent", "accentText"],
  ["onAccent", "accentHover"],
];

export const fonts = {
  display: '"Lexend Variable", system-ui, sans-serif',
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace',
};

/** 4px base. Keys are multiples of 4px. */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 18: 72, 24: 96 };

export const radius = { chip: 4, control: 8, card: 12, full: 999 };

export const widths = { text: 680, wide: 1120 };
