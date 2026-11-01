import { defineHastPlugin, type HastNode } from "satteri";

type ElementNode = Extract<HastNode, { type: "element" }>;
type ChildNode = ElementNode["children"][number];

import { calloutIcons, calloutTitles, type CalloutType } from "../design/callouts.ts";

// GitHub's [!IMPORTANT] renders as a note titled "Important"
type MarkerType = CalloutType | "important";

// Captures: [1] = type, [2] = title (rest of first line)
const CALLOUT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*([^\n]*)/i;

/**
 * Copies a node into a plain object. Sätteri hands visitors lazy, read-only
 * views of the tree, which can't be cloned with structuredClone.
 */
export function toPlain(node: ChildNode): ChildNode {
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
 * Output: <aside class="ks-callout" data-type="note">
 *           <p class="ks-callout-title"><svg class="ks-callout-icon">…</svg>Title here</p>
 *           <div class="ks-callout-body">...</div>
 *         </aside>
 *
 * The same markup as the Callout component in src/design/components.
 */
export default defineHastPlugin({
  name: "callouts",
  element: {
    filter: ["blockquote"],
    visit(node, ctx) {
      const match = ctx.textContent(node).trimStart().match(CALLOUT_REGEX);
      if (!match) return;

      const marker = match[1].toLowerCase() as MarkerType;
      const type: CalloutType = marker === "important" ? "note" : marker;
      const title = match[2].trim() || (marker === "important" ? "Important" : calloutTitles[type]);

      const contentChildren = node.children.map(toPlain);
      for (const child of contentChildren) {
        if (stripMarker(child)) break;
      }

      ctx.replaceNode(node, {
        type: "element",
        tagName: "aside",
        properties: { className: ["ks-callout"], dataType: type },
        children: [
          {
            type: "element",
            tagName: "p",
            properties: { className: ["ks-callout-title"] },
            children: [
              {
                type: "element",
                tagName: "svg",
                properties: {
                  className: ["ks-callout-icon"],
                  viewBox: "0 0 24 24",
                  ariaHidden: "true",
                },
                children: [
                  {
                    type: "element",
                    tagName: "path",
                    properties: { d: calloutIcons[type] },
                    children: [],
                  },
                ],
              },
              { type: "text", value: title },
            ],
          },
          {
            type: "element",
            tagName: "div",
            properties: { className: ["ks-callout-body"] },
            children: contentChildren,
          },
        ],
      });
    },
  },
});
