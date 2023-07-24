import { getSortedPostMetadata } from "@/lib/posts";
import Link from "next/link";
import PostMetadata from "@/components/PostMetadata";

export default async function Posts() {
  const posts = getSortedPostMetadata();

  return (
    <div className="mt-4">
      {posts.map((p) => (
        <Link key={p.id} href={`/posts/${p.id}`}>
          <div className="rounded border-[1px] border-transparent bg-gray-200 p-2 transition hover:border-gray-400 sm:bg-transparent">
            <h2 className="text-xl">{p.metadata.title}</h2>
            <PostMetadata post={p} showAvatar={false} />
          </div>
        </Link>
      ))}
    </div>
  );
}
