import { Node } from "unist";
import { visit } from "unist-util-visit";

interface HeadingNode extends Node {
  type: "element";
  tagName: string;
  properties: {
    id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: Array<{ type: string; value?: string; children?: any[] }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isHeadingNode(node: any): node is HeadingNode {
  return (
    node.type === "element" && /^h[1-6]$/.test(node.tagName) && node.children
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextFromNode(node: any): string {
  if (node.type === "text") {
    return node.value || "";
  }
  if (node.children) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "element", (node: any) => {
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
