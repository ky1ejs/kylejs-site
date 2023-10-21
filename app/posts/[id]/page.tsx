import * as runtime from "react/jsx-runtime";
import { getAllPosts, readPostWithId } from "@/lib/posts";
import { compile, run } from "@mdx-js/mdx";
import { MDXComponents } from "mdx/types";
import { DownloadFile } from "@/components/DownloadFile";
import remarkGfm from "remark-gfm";
import { JSX } from "react";
import PostFooter from "@/components/PostFooter";
import PostHeader from "@/components/PostHeader";
import Image from "next/image";
import imageMetadata from "@/lib/rehype-image-size";
import BlogWipNotice from "@/components/BlogWipNotice";

type PostParams = {
  id: string;
};

const h3 = ({ children }: JSX.IntrinsicElements["h3"]) => (
  <>
    <h3>{children}</h3>
    <hr className="mb-2 border-[1px] border-gray-300" />
  </>
);

const components: MDXComponents = {
  DownloadFile,
  h3,
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: (props) => <Image placeholder="blur" {...props} />,
};

export default async function Post({ params: { id } }: { params: PostParams }) {
  const post = await readPostWithId(id);
  const compiled = await compile(post.content, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [imageMetadata],
  });
  const result = await run(compiled, runtime);
  const Content = result.default;
  return (
    <>
      <BlogWipNotice />
      <article>
        <PostHeader post={post} />
        <Content components={components} />
      </article>
      <PostFooter />
    </>
  );
}

export async function generateMetadata({ params }: { params: PostParams }) {
  const post = await readPostWithId(params.id);

  return {
    title: post.metadata.title,
  };
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => {
    return { id: post.id };
  });
}
