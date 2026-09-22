/**
 * Line-art marks, one per area, plus the pen used to tag writing.
 *
 * Drawn from Kyle's tattoo reference: uniform stroke, no fill, no shading, and a
 * specific object rather than an abstract glyph (a portafilter, not a coffee cup).
 * Rendered by AreaMark.astro, which inherits `color` so they take the accent in
 * either theme.
 */
export type MarkName =
  | "code"
  | "printer"
  | "chip"
  | "keyboard"
  | "coffee"
  | "camera"
  | "fish"
  | "mountain"
  | "weight"
  | "pen";

export const markPaths: Record<MarkName, string> = {
  code: '<path d="M11 13h42v29H11z"/><path d="M5 50h54l-5-8H10z"/><path d="M26 47h12"/><path d="M23 23l-6 5 6 5"/><path d="M41 23l6 5-6 5"/><path d="M36 21l-8 14"/>',
  printer:
    '<path d="M8 9v45M56 9v45"/><path d="M8 9h48"/><path d="M8 21h48"/><path d="M31 21v6"/><path d="M27 27h9l-4 6z"/><path d="M11 49h42"/><path d="M23 49c0-11 3-16 9-16s9 5 9 16"/><path d="M24 43h16M23 46h18"/>',
  chip: '<path d="M15 13h34v38H15z"/><path d="M26 6h12v7H26z"/><path d="M25 25h14v13H25z"/><path d="M19 19h4M19 24h4M19 29h4M19 34h4M41 19h4M41 24h4M41 29h4M41 34h4"/><path d="M22 44h8M35 44c6 0 8 4 8 8"/><circle cx="43" cy="55" r="2"/>',
  keyboard:
    '<path d="M4 28l22-5v15L4 43z"/><path d="M60 28l-22-5v15l22 5z"/><path d="M26 33c4 7 8 7 12 0"/><path d="M9 30l14-3M9 35l14-3M55 30l-14-3M55 35l-14-3"/>',
  coffee:
    '<ellipse cx="25" cy="18" rx="16" ry="5.5"/><path d="M9 18c0 9 2 15 5 19h22c3-4 5-10 5-19"/><path d="M19 37l-1 10h5l-1-10"/><path d="M31 37l1 10h-5l1-10"/><path d="M41 18l17 4v6l-16-4"/><path d="M46 20.5l-1 6M51 22l-1 6"/>',
  camera:
    '<path d="M6 19h11l4-6h20l4 6h13v30H6z"/><circle cx="32" cy="34" r="11"/><circle cx="32" cy="34" r="5.5"/><circle cx="50" cy="25" r="1.6"/><path d="M11 24h6"/>',
  fish: '<path d="M5 36c9-14 29-14 38 0-9 14-29 14-38 0z"/><path d="M43 36l14-9v18z"/><circle cx="15" cy="31" r="1.7"/><path d="M20 25c4-5 10-6 15-3"/><path d="M22 46c4 4 9 4 13 1"/><path d="M12 36h5M24 32h4M30 40h4"/>',
  mountain:
    '<path d="M3 50l17-27 9 14 7-10 25 23z"/><path d="M14 39l6 5M32 33l5 6"/><path d="M50 50v-7"/><path d="M45 45l5-6 5 6M46 40l4-5 4 5"/><circle cx="48" cy="15" r="5"/>',
  weight:
    '<path d="M4 25v14M9 19v26M55 19v26M60 25v14"/><path d="M9 32h46"/><path d="M15 27v10M49 27v10"/><path d="M24 29h16M24 35h16"/>',
  pen: '<path d="M45 8l9 9-30 30-12 3 3-12z"/><path d="M40 13l9 9"/><path d="M12 50l4 4"/><path d="M8 58h48"/>',
};
