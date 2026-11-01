// The site's marks, drawn on a 24×24 grid with a 1.75px stroke.
//
// `shape` is the main silhouette: filled with accent soft and outlined.
// `detail` is drawn on top as line only. Below 20px, Mark drops the fill.

export interface MarkPaths {
  shape: string;
  detail: string;
}

export const marks = {
  coding: {
    shape:
      "M5 5h14a1.5 1.5 0 0 1 1.5 1.5V16h-17V6.5A1.5 1.5 0 0 1 5 5z M2 16h20l-.7 2a1.5 1.5 0 0 1-1.4 1H4.1a1.5 1.5 0 0 1-1.4-1z",
    detail: "M10 8.5l-2 2 2 2 M14 8.5l2 2-2 2",
  },
  printing: {
    shape:
      "M10 3.5h4a1 1 0 0 1 1 1v4.5a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-4.5a1 1 0 0 1 1 -1z M8.75 11.5h8.5a1.25 1.25 0 0 1 1.25 1.25v2.5a1.25 1.25 0 0 1 -1.25 1.25h-8.5a1.25 1.25 0 0 1 -1.25 -1.25v-2.5a1.25 1.25 0 0 1 1.25 -1.25z M10.25 16.5h3.5l-1.1 2.5h-1.3z",
    detail: "M12 1V3.5 M9 5.75h6 M9 7.75h6 M12 10v1.5 M15.5 14h.01 M12 19v3.5",
  },
  electronics: {
    shape: "M8 6h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
    detail:
      "M10 3v3 M14 3v3 M10 18v3 M14 18v3 M3 10h3 M3 14h3 M18 10h3 M18 14h3 M10.5 10.5h3v3h-3z",
  },
  keyboards: {
    shape:
      "M4 5h16a2.5 2.5 0 0 1 2.5 2.5v9a2.5 2.5 0 0 1 -2.5 2.5h-16a2.5 2.5 0 0 1 -2.5 -2.5v-9a2.5 2.5 0 0 1 2.5 -2.5z",
    detail:
      "M4.75 9h.01 M7.65 9h.01 M10.55 9h.01 M13.45 9h.01 M16.35 9h.01 M19.25 9h.01 M6.2 12h.01 M9.1 12h.01 M12 12h.01 M14.9 12h.01 M17.8 12h.01 M4.75 15.5h.01 M8 15.5h8 M19.25 15.5h.01",
  },
  photography: {
    shape:
      "M4.5 7.5h2.8L8.8 5h6.4l1.5 2.5h2.8A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V9a1.5 1.5 0 0 1 1.5-1.5z",
    detail: "M15.5 13a3.5 3.5 0 1 1-7 0a3.5 3.5 0 1 1 7 0z M17.8 10h.01",
  },
  coffee: {
    shape: "M17.16 4.63A6.5 9 35 1 0 6.84 19.37A6.5 9 35 1 0 17.16 4.63z",
    detail: "M16.27 6.42C15.51 11.16 8.49 12.84 7.73 17.58",
  },
  fishing: {
    shape: "M2.5 12c2.8-4.2 9.5-5.2 14.5 0c-5 5.2-11.7 4.2-14.5 0z M17 12l4.5-3.5v7z",
    detail: "M6.5 11.2h.01 M9.8 9.2c.9 1.6.9 4 0 5.6",
  },
  outdoors: {
    shape: "M2 20l6.5-10.5 4 6 3-4L22 20z",
    detail: "M19.5 6a2 2 0 1 1-4 0a2 2 0 1 1 4 0z",
  },
  training: {
    shape:
      "M3 8.5h0.5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-0.5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1z M5.75 5.5h1a1.25 1.25 0 0 1 1.25 1.25v10.5a1.25 1.25 0 0 1 -1.25 1.25h-1a1.25 1.25 0 0 1 -1.25 -1.25v-10.5a1.25 1.25 0 0 1 1.25 -1.25z M17.25 5.5h1a1.25 1.25 0 0 1 1.25 1.25v10.5a1.25 1.25 0 0 1 -1.25 1.25h-1a1.25 1.25 0 0 1 -1.25 -1.25v-10.5a1.25 1.25 0 0 1 1.25 -1.25z M20.5 8.5h0.5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-0.5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1z",
    detail: "M8 12h8",
  },
  writing: {
    shape: "M15.5 4.5l4 4L9 19l-5 1 1-5z",
    detail: "M13.5 6.5l4 4 M5 15l4 4",
  },
} satisfies Record<string, MarkPaths>;

export type MarkName = keyof typeof marks;

export const markNames = Object.keys(marks) as MarkName[];
