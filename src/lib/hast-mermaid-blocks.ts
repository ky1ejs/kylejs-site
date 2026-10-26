import { defineHastPlugin } from "satteri";

/**
 * Sätteri hast plugin that turns ```mermaid code blocks in MDX into
 * <Mermaid chart="..." /> component calls.
 *
 * Requires "mermaid" in `markdown.syntaxHighlight.excludeLangs`, otherwise
 * Shiki highlights the block before this plugin sees it.
 */
export default defineHastPlugin({
  name: "mermaid-blocks",
  element: {
    filter: ["pre"],
    visit(node, ctx) {
      // Plain Markdown can't render components
      if (ctx.sourceFormat !== "mdx") return;

      const code = node.children.find(
        (child) => child.type === "element" && child.tagName === "code",
      );
      if (code?.type !== "element") return;

      const className = code.properties?.className;
      if (!Array.isArray(className) || !className.includes("language-mermaid"))
        return;

      ctx.replaceNode(node, {
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: ctx.textContent(code).trim(),
          },
        ],
        children: [],
      });
    },
  },
});
