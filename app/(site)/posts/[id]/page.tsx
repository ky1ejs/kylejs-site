import { getAllPosts, readPostWithId } from "@/lib/posts";
import PostFooter from "@/components/PostFooter";
import PostHeader from "@/components/PostHeader";
import compileMarkdown from "@/lib/markdown-compile";
import { Metadata } from "next";

type PostParams = {
  id: string;
};

export default async function Post(props: { params: Promise<PostParams> }) {
  const params = await props.params;

  const { id } = params;

  const post = await readPostWithId(id);
  const Content = await compileMarkdown(post.content);
  return (
    <>
      <article>
        <PostHeader post={post} />
        <Content />
      </article>
      <PostFooter />
    </>
  );
}

export const generateMetadata = async (props: {
  params: Promise<PostParams>;
}): Promise<Metadata> => {
  const id = (await props.params).id;
  const post = await readPostWithId(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kylejs.me";
  const url = `${baseUrl}/blog/${id}`;
  const profileImage = `${baseUrl}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fme.a6ba7c02.jpg&w=256&q=75`;

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      url,
      images: [profileImage],
      type: "article",
      publishedTime: post.metadata.date.toISOString(),
      modifiedTime: post.metadata.date.toISOString(),
      authors: ["Kyle Satti"],
      siteName: "Kyle Satti",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: post.metadata.description,
      images: [profileImage],
      creator: "@_kylejs_",
    },
  };
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => {
    return { id: post.id };
  });
}
