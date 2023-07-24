import { getSortedPostMetadata } from "@/lib/posts";
import Link from "next/link";

export default async function Posts() {
  const posts = getSortedPostMetadata();

  console.log(posts.map((p) => p.metadata.title));

  return (
    <div>
      {posts.map((p) => (
        <div key={p.id}>
          <Link href={`/posts/${p.id}`}>{p.metadata.title}</Link>
        </div>
      ))}
    </div>
  );
}
