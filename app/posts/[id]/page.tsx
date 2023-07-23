import * as runtime from "react/jsx-runtime";
import { getAllPostIds, getPostData } from "@/lib/posts";
import { compile, run } from "@mdx-js/mdx";
import { MDXComponents } from "mdx/types";
import calculateReadingTime from "@/lib/reading-time";
import { DownloadFile } from "@/components/DownloadFile";
import remarkGfm from "remark-gfm";
import { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import RelativeDateLabel from "@/components/RelativeDateLabel";
import PostSocialsLabel from "@/components/PostSocialsLabel";

type Props = {
  params: { id: string };
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
};

export default async function Post({ params }: Props) {
  const post = await getPostData(params.id);
  const compiled = await compile(post.content, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm],
  });
  const result = await run(compiled, runtime);
  const Content = result.default;
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1>{post.metadata.title}</h1>
        <div className="mt-2 flex items-center divide-x-[1px] divide-gray-400 text-sm text-gray-500">
          <div className="flex items-center gap-2 pr-2">
            <Link href="/">
              <Image
                src="/me.jpg"
                width={30}
                height={30}
                alt="Profile picture of Kyle Satti"
                className="mr-2 inline rounded-full transition hover:scale-110"
              />
              Written by{" "}
              <span className="transition hover:text-primary">Kyle Satti</span>
            </Link>
          </div>
          <p className="px-2">{calculateReadingTime(post.content)}</p>
          <div className="pl-2">
            <RelativeDateLabel date={post.metadata.date} />
          </div>
        </div>
      </div>
      <Content components={components} />
      <div className="mb-20 mt-16 text-center text-sm text-gray-500">
        <hr />
        <p className="mt-6">Thank you for reading 🙏🏼</p>
        <PostSocialsLabel />
      </div>
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
