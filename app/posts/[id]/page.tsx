import * as runtime from "react/jsx-runtime";
import { getAllPostIds, getPostData } from "@/lib/posts";
import { compile, run } from "@mdx-js/mdx";
import { MDXComponents } from "mdx/types";
import calculateReadingTime from "@/lib/reading-time";

type Props = {
  params: { id: string };
};

const components: MDXComponents = {};

export default async function Post({ params }: Props) {
  const post = await getPostData(params.id);
  const compiled = await compile(post.content, {
    outputFormat: "function-body",
    development: false,
  });
  const result = await run(compiled, runtime);
  const Content = result.default;
  return (
    <>
      <h1>{post.metadata.title}</h1>
      <h4>{calculateReadingTime(post.content)}</h4>
      <Content components={components} />;
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostData(params.id);

  return {
    title: post.metadata.title,
  };
}

export async function generateStaticParams(): Promise<Props[]> {
  return getAllPostIds().map((post) => {
    return { params: post };
  });
}
