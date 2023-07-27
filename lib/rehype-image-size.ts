import imageSize from "image-size";
import path from "path";
import { Node } from "unist";
import { visit } from "unist-util-visit";
import { promisify } from "util";

// This file is an adapeted version of the code snippet from:
// https://kylepfromer.com/blog/nextjs-image-component-blog

const sizeOf = promisify(imageSize);

interface Attribute {
  name: string;
  value: string | number | boolean | null;
  type: "mdxJsxAttribute";
}

interface ImageNode extends Node {
  name: string;
  attributes: Attribute[];
}

/**
 * Determines whether the given HAST node is an `<Image>` element.
 */
function isImageNode(node: Node): node is ImageNode {
  const img = node as ImageNode;

  const keyedAttributes = new Map(img.attributes.map((i) => [i.name, i.value]));

  return img.name === "Image" && keyedAttributes.has("src");
}

/**
 * Adds the image's `height` and `width` to it's properties.
 */
async function addMetadata(node: ImageNode): Promise<void> {
  const keyedAttributes = new Map(
    node.attributes.map((i) => [i.name, i.value]),
  );

  const src = keyedAttributes.get("src");
  if (!src) throw Error(`Invalid image with src "${src}"`);

  const res = await sizeOf(path.join(process.cwd(), "public", src.toString()));

  if (!res) throw Error(`Invalid image with src "${src}"`);

  node.attributes.push({
    name: "width",
    value: res.width ?? null,
    type: "mdxJsxAttribute",
  });
  node.attributes.push({
    name: "height",
    value: res.height ?? null,
    type: "mdxJsxAttribute",
  });
}

/**
 * This is a Rehype plugin that finds image `<Image>` elements and adds the height and width to the properties.
 * Read more about Next.js image: https://nextjs.org/docs/api-reference/next/image#layout
 */
export default function imageMetadata() {
  return async function transformer(tree: Node): Promise<Node> {
    const imgNodes: ImageNode[] = [];

    visit(tree, "mdxJsxFlowElement", (node) => {
      if (isImageNode(node)) {
        imgNodes.push(node);
      }
    });

    console.log(`Found ${imgNodes.length} images`);

    for (const node of imgNodes) {
      await addMetadata(node);
    }

    return tree;
  };
}
