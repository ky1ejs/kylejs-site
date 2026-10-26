import { defineHastPlugin, type HastNode } from "satteri";

type ElementNode = Extract<HastNode, { type: "element" }>;
type ChildNode = ElementNode["children"][number];

type CalloutType = "note" | "tip" | "important" | "warning" | "caution";

const CALLOUT_ICONS: Record<CalloutType, string> = {
  note: "ℹ️",
  tip: "💡",
  important: "❗",
  warning: "⚠️",
  caution: "🔴",
};

const DEFAULT_TITLES: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

// Captures: [1] = type, [2] = title (rest of first line)
const CALLOUT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([^\n]*)/i;

/**
 * Copies a node into a plain object. Sätteri hands visitors lazy, read-only
 * views of the tree, which can't be cloned with structuredClone.
 */
function toPlain(node: ChildNode): ChildNode {
  const copy: Record<string, unknown> = { type: node.type };
  if ("tagName" in node) copy.tagName = node.tagName;
  if ("properties" in node) copy.properties = { ...node.properties };
  if ("value" in node) copy.value = node.value;
  // MDX JSX elements (e.g. <Pill>) inside a callout
  if ("name" in node) copy.name = node.name;
  if ("attributes" in node) {
    copy.attributes = node.attributes.map((attr) => ({ ...attr }));
  }
  if ("children" in node) {
    copy.children = node.children.map((child) => toPlain(child as ChildNode));
  }
  return copy as unknown as ChildNode;
}

/**
 * Removes the first line ([!TYPE] Title) from the first non-whitespace text
 * node. Returns true once that text node has been found.
 */
function stripMarker(node: ChildNode): boolean {
  if (node.type === "text") {
    const match = node.value.match(CALLOUT_REGEX);
    if (match) {
      node.value = node.value.slice(match[0].length).replace(/^\n/, "");
      return true;
    }
    return node.value.trim() !== "";
  }
  if ("children" in node) {
    for (const child of node.children) {
      if (stripMarker(child as ChildNode)) return true;
    }
  }
  return false;
}

/**
 * Sätteri hast plugin that transforms GitHub-style callout blockquotes into
 * styled callout elements.
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
export default defineHastPlugin({
  name: "callouts",
  element: {
    filter: ["blockquote"],
    visit(node, ctx) {
      const match = ctx.textContent(node).trimStart().match(CALLOUT_REGEX);
      if (!match) return;

      const type = match[1].toLowerCase() as CalloutType;
      const title = match[2].trim() || DEFAULT_TITLES[type];

      const contentChildren = node.children.map(toPlain);
      for (const child of contentChildren) {
        if (stripMarker(child)) break;
      }

      ctx.replaceNode(node, {
        type: "element",
        tagName: "div",
        properties: { className: ["callout", `callout-${type}`] },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["callout-title"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["callout-icon"] },
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
            properties: { className: ["callout-content"] },
            children: contentChildren,
          },
        ],
      });
    },
  },
});
