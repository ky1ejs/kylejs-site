import { defineHastPlugin } from "satteri";
import { toPlain } from "./hast-callouts.ts";

const WRAPPER_TAG = "heading-wrapper";

/**
 * Sätteri hast plugin that puts a "copy link" anchor beside each heading
 * that has an ID. The anchor sits next to the heading, not inside it, so
 * screen readers don't read its label as part of the heading.
 *
 * The wrapper is a custom element, not a div. Safari Reader prunes a div
 * whose class matches /link/ or whose text is under 25 characters, which
 * dropped every heading. It leaves unknown elements alone.
 *
 * Without JavaScript the anchor jumps to the heading; the HeadingLinks
 * component's script copies the URL instead. Skips GFM's footnotes heading.
 */
export default defineHastPlugin({
  name: "heading-links",
  element: {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    visit(node, ctx) {
      const id = node.properties.id;
      if (typeof id !== "string" || id === "footnote-label") return;

      const parent = ctx.parent(node);
      if (parent?.type === "element" && parent.tagName === WRAPPER_TAG) return;

      ctx.replaceNode(node, {
        type: "element",
        tagName: WRAPPER_TAG,
        properties: {},
        children: [
          toPlain(node),
          {
            type: "element",
            tagName: "a",
            properties: {
              className: ["heading-link"],
              href: `#${id}`,
              ariaLabel: `Copy link to ${ctx.textContent(node).trim()}`,
              title: "Copy link to this heading",
            },
            children: [],
          },
        ],
      });
    },
  },
});
