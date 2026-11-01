// The text column shared by Site.astro and PageLoader's skeleton, so the
// skeleton lines up with the page it stands in for. Tailwind reads the class
// strings from this file.

/** 680px of text plus the page gutters: 24px under 640px, 32px from 640px */
export const TEXT_COLUMN_CLASS = "mx-auto max-w-[calc(var(--ks-width-text)+4rem)] px-6 min-[640px]:px-8";

/** `sizes` for an image that fills the text column */
export const TEXT_COLUMN_SIZES = "(min-width: 744px) 680px, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 3rem)";

/** 1120px plus the page gutters, for the home page and grids */
export const WIDE_COLUMN_CLASS = "mx-auto max-w-[calc(var(--ks-width-wide)+4rem)] px-6 min-[640px]:px-8";
