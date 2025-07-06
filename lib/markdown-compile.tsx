import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import imageMetadata from "@/lib/rehype-image-size";
import headingIds from "@/lib/rehype-heading-ids";
import { DownloadFile } from "@/components/DownloadFile";
import { MDXComponents } from "mdx/types";
import React, { JSX } from "react";
import Image from "next/image";
import { Pill, PillCollection } from "@/components/Pill";
import Link from "next/link";

const components: MDXComponents = {
  DownloadFile,
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: (props) => <Image placeholder="blur" {...props} />,
  Pill,
  PillCollection,
  Link,
};

export default async function compileMarkdown(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markdown: any,
): Promise<() => JSX.Element> {
  const compiled = await compile(markdown, {
    outputFormat: "function-body",
    development: process.env.NODE_ENV === "development",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [headingIds, imageMetadata],
  });
  const result = await run(compiled, { ...runtime, baseUrl: import.meta.url });
  // eslint-disable-next-line react/display-name
  return () => <result.default components={components} />;
}
