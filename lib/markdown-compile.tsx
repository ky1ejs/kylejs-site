import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import imageMetadata from "@/lib/rehype-image-size";
import headingIds from "@/lib/rehype-heading-ids";
import rehypeCallouts from "@/lib/rehype-callouts";
import rehypeMermaidBlocks from "@/lib/rehype-mermaid-blocks";
import { DownloadFile } from "@/components/DownloadFile";
import { H1, H2, H3, H4, H5, H6 } from "@/components/HeadingWithLink";
import { Mermaid } from "@/components/Mermaid";
import { MDXComponents } from "mdx/types";
import React, { JSX } from "react";
import Image from "next/image";
import { Pill, PillCollection } from "@/components/Pill";
import { GitHubRepoCard } from "@/components/GitHubRepoCard";
import Link from "next/link";

const components: MDXComponents = {
  DownloadFile,
  GitHubRepoCard,
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: (props) => <Image placeholder="blur" {...props} />,
  Pill,
  PillCollection,
  Link,
  Mermaid,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
};

export default async function compileMarkdown(
  markdown: string,
): Promise<() => JSX.Element> {
  const compiled = await compile(markdown, {
    outputFormat: "function-body",
    development: process.env.NODE_ENV === "development",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      headingIds,
      imageMetadata,
      rehypeCallouts,
      rehypeMermaidBlocks,
    ],
  });
  const result = await run(compiled, { ...runtime, baseUrl: import.meta.url });
  // eslint-disable-next-line react/display-name
  return () => <result.default components={components} />;
}
