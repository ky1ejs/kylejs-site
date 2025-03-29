import { getAllPosts, readPostWithId } from "@/lib/posts";
import PostFooter from "@/components/PostFooter";
import PostHeader from "@/components/PostHeader";
import compileMarkdown from "@/lib/markdown-compile";

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

export async function generateMetadata(props: { params: Promise<PostParams> }) {
  const params = await props.params;
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
