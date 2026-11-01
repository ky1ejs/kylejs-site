// Callout types, titles and line icons. Shared by the React Callout and the
// hast-callouts Markdown plugin, so both emit the same markup.

export type CalloutType = "note" | "tip" | "warning" | "caution";

/** Line icons on a 24×24 grid, drawn with a 1.75px stroke. */
export const calloutIcons: Record<CalloutType, string> = {
  note: "M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18z M12 11v5 M12 7.5v.5",
  tip: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  warning:
    "M10.3 4.2a2 2 0 0 1 3.4 0l7.6 13.3A2 2 0 0 1 19.6 20.5H4.4a2 2 0 0 1-1.7-3z M12 10v4 M12 17h.01",
  caution: "M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2z M12 8v5 M12 16h.01",
};

export const calloutTitles: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  caution: "Caution",
};
