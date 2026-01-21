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

interface BlockquoteNode extends ElementNode {
  tagName: "blockquote";
}

type CalloutType = "note" | "tip" | "important" | "warning" | "caution";

const CALLOUT_ICONS: Record<CalloutType, string> = {
  note: "ℹ️",
  tip: "💡",
  important: "❗",
  warning: "⚠️",
  caution: "🔴",
};

// Captures: [1] = type, [2] = title (rest of first line)
const CALLOUT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([^\n]*)/i;

function isBlockquoteNode(node: Node): node is BlockquoteNode {
  return (
    node.type === "element" &&
    "tagName" in node &&
    node.tagName === "blockquote" &&
    "children" in node
  );
}

function getFirstMeaningfulText(node: ChildNode): string | null {
  if (node.type === "text" && "value" in node) {
    const value = node.value as string;
    // Skip whitespace-only text nodes
    if (value.trim()) {
      return value;
    }
    return null;
  }
  if ("children" in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      const result = getFirstMeaningfulText(child);
      if (result) return result;
    }
  }
  return null;
}

const DEFAULT_TITLES: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

function extractCalloutInfo(
  text: string,
): { type: CalloutType; title: string } | null {
  const match = text.match(CALLOUT_REGEX);
  if (!match) return null;

  const type = match[1].toLowerCase() as CalloutType;
  // Use the text after [!TYPE] as title, or fall back to default
  const title = match[2]?.trim() || DEFAULT_TITLES[type];
  return { type, title };
}

/**
 * Rehype plugin that transforms GitHub-style callout blockquotes into styled callout elements.
 *
 * Input: > [!NOTE] Title here
 *        > Content here
 *
 * Output: <div class="callout callout-note">
 *           <div class="callout-title">
 *             <span class="callout-icon">ℹ️</span>
 *             <span>Title here</span>
 *           </div>
 *           <div class="callout-content">...</div>
 *         </div>
 */
export default function rehypeCallouts() {
  return function transformer(tree: Node): Node {
    visit(
      tree,
      "element",
      (node: Node, index: number | undefined, parent: Node | undefined) => {
        if (!isBlockquoteNode(node) || index === undefined || !parent) return;

        const firstText = getFirstMeaningfulText(node);
        if (!firstText) return;

        const calloutInfo = extractCalloutInfo(firstText);
        if (!calloutInfo) return;

        const { type, title } = calloutInfo;

        // Remove the first line ([!TYPE] Title) from the first meaningful text node
        const modifyFirstText = (child: ChildNode): boolean => {
          if (child.type === "text" && "value" in child) {
            const text = child.value as string;
            const match = text.match(CALLOUT_REGEX);
            if (match) {
              // Remove the entire first line (marker + title), keep content after newline
              const remaining = text.slice(match[0].length).replace(/^\n/, "");
              child.value = remaining;
              return true;
            }
            // Skip whitespace-only text nodes
            if (!text.trim()) {
              return false;
            }
          }
          if ("children" in child && Array.isArray(child.children)) {
            for (const c of child.children) {
              if (modifyFirstText(c)) return true;
            }
          }
          return false;
        };

        // Clone children and modify the first text
        const contentChildren = JSON.parse(
          JSON.stringify(node.children),
        ) as ChildNode[];
        for (const child of contentChildren) {
          if (modifyFirstText(child)) break;
        }

        // Create the callout structure
        const calloutNode: ElementNode = {
          type: "element",
          tagName: "div",
          properties: { className: `callout callout-${type}` },
          children: [
            {
              type: "element",
              tagName: "div",
              properties: { className: "callout-title" },
              children: [
                {
                  type: "element",
                  tagName: "span",
                  properties: { className: "callout-icon" },
                  children: [{ type: "text", value: CALLOUT_ICONS[type] }],
                },
                {
                  type: "element",
                  tagName: "span",
                  properties: {},
                  children: [{ type: "text", value: title }],
                },
              ],
            },
            {
              type: "element",
              tagName: "div",
              properties: { className: "callout-content" },
              children: contentChildren,
            },
          ],
        };

        // Replace the blockquote with the callout
        if ("children" in parent && Array.isArray(parent.children)) {
          parent.children[index] = calloutNode;
        }
      },
    );

    return tree;
  };
}
