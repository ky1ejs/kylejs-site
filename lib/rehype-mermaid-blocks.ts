import { Node } from "unist";
import { visit } from "unist-util-visit";

interface TextNode {
  type: "text";
  value: string;
}

interface ElementNode extends Node {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: ChildNode[];
}

type ChildNode = TextNode | ElementNode | Node;

/**
 * Rehype plugin that transforms mermaid code blocks into Mermaid component calls.
 * Looks for <pre><code class="language-mermaid"> and converts them to <Mermaid chart="...">
 */
export default function rehypeMermaidBlocks() {
  return function transformer(tree: Node): Node {
    visit(
      tree,
      "element",
      (node: Node, index: number | undefined, parent: Node | undefined) => {
        if (index === undefined || !parent) return;

        const element = node as ElementNode;

        // Look for pre > code.language-mermaid
        if (element.tagName !== "pre") return;
        if (!element.children || element.children.length === 0) return;

        const codeElement = element.children[0] as ElementNode;
        if (codeElement.type !== "element" || codeElement.tagName !== "code")
          return;

        const className = codeElement.properties?.className;
        if (
          !Array.isArray(className) ||
          !className.includes("language-mermaid")
        )
          return;

        // Extract the mermaid code
        const textNode = codeElement.children[0] as TextNode;
        if (!textNode || textNode.type !== "text") return;

        const chart = textNode.value.trim();

        // Replace with Mermaid component element
        const mermaidNode: ElementNode = {
          type: "element",
          tagName: "Mermaid",
          properties: { chart },
          children: [],
        };

        if ("children" in parent && Array.isArray(parent.children)) {
          parent.children[index] = mermaidNode;
        }
      },
    );

    return tree;
  };
}
