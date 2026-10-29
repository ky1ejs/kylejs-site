import { defineHastPlugin, type HastNode } from "satteri";
import { toPlain } from "./hast-callouts.ts";

type ElementNode = Extract<HastNode, { type: "element" }>;

const MARK_CLASS = "heading-mark";

function isMark(node: ElementNode["children"][number] | undefined): boolean {
  if (node?.type !== "element" || node.tagName !== "span") return false;
  const className = node.properties.className;
  return Array.isArray(className) && className.includes(MARK_CLASS);
}

/**
 * Sätteri hast plugin that wraps each h2's content in
 * <span class="heading-mark">, so the post styles can draw a highlighter
 * behind the words rather than the whole column.
 *
 * Skips GFM's footnotes heading, which stays plain.
 */
export default defineHastPlugin({
  name: "heading-marks",
  element: {
    filter: ["h2"],
    visit(node, ctx) {
      if (node.properties.id === "footnote-label") return;
      if (node.children.length === 0 || isMark(node.children[0])) return;

      ctx.replaceNode(node, {
        type: "element",
        tagName: "h2",
        properties: { ...node.properties },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: [MARK_CLASS] },
            children: node.children.map(toPlain),
          },
        ],
      });
    },
  },
});
