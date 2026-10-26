import { defineHastPlugin } from "satteri";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Sätteri hast plugin that adds unique IDs to headings.
 *
 * Astro's built-in heading IDs (github-slugger) keep repeated hyphens, e.g.
 * "Nutrition & Diet" -> "nutrition--diet". This slugifier collapses them to
 * "nutrition-diet", which keeps existing post anchors stable. Astro's built-in
 * plugin runs after this one and keeps any ID already set.
 *
 * Exported as a factory so the set of used IDs resets for every document.
 */
export default function hastHeadingIds() {
  const usedIds = new Set<string>();

  return defineHastPlugin({
    name: "heading-ids",
    element: {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      visit(node, ctx) {
        const id = slugify(ctx.textContent(node));

        let finalId = id;
        let counter = 1;
        while (usedIds.has(finalId)) {
          finalId = `${id}-${counter}`;
          counter++;
        }
        usedIds.add(finalId);

        ctx.setProperty(node, "id", finalId);
      },
    },
  });
}
