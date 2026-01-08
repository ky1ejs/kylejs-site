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

interface HeadingNode extends ElementNode {
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

function isHeadingNode(node: Node): node is HeadingNode {
  return (
    node.type === "element" &&
    "tagName" in node &&
    /^h[1-6]$/.test(node.tagName as string) &&
    "children" in node
  );
}

function extractTextFromNode(node: ChildNode): string {
  if (node.type === "text" && "value" in node) {
    return (node.value as string) || "";
  }
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join("");
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * This is a Rehype plugin that finds heading elements and adds unique IDs to them.
 */
export default function headingIds() {
  return function transformer(tree: Node): Node {
    const usedIds = new Set<string>();

    visit(tree, "element", (node: Node) => {
      if (isHeadingNode(node)) {
        // Extract text content from the heading
        const textContent = node.children.map(extractTextFromNode).join("");
        const id = slugify(textContent);

        // Ensure uniqueness
        let finalId = id;
        let counter = 1;
        while (usedIds.has(finalId)) {
          finalId = `${id}-${counter}`;
          counter++;
        }

        usedIds.add(finalId);

        // Add the ID to the heading
        if (!node.properties) {
          node.properties = {};
        }
        node.properties.id = finalId;
      }
    });

    return tree;
  };
}
