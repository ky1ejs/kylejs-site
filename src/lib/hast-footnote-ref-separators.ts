import { defineHastPlugin, type HastNode } from "satteri";

function isFootnoteRef(node: HastNode | undefined): boolean {
  if (node?.type !== "element" || node.tagName !== "sup") return false;
  const link = node.children[0];
  return (
    link?.type === "element" &&
    link.tagName === "a" &&
    "dataFootnoteRef" in link.properties
  );
}

/**
 * Sätteri hast plugin that puts a comma between adjacent footnote refs, so
 * `[^a][^b]` reads "1,2" rather than "12".
 */
export default defineHastPlugin({
  name: "footnote-ref-separators",
  element: {
    filter: ["sup"],
    visit(node, ctx) {
      if (!isFootnoteRef(node)) return;
      const parent = ctx.parent(node);
      const index = ctx.indexOf(node);
      if (!parent || index === undefined) return;
      if (!isFootnoteRef(parent.children[index + 1])) return;

      ctx.insertAfter(node, {
        type: "element",
        tagName: "sup",
        properties: {},
        children: [{ type: "text", value: "," }],
      });
    },
  },
});
