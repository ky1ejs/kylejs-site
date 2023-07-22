import { getSortedPostMetadata } from "@/lib/posts";
import Link from "next/link";

export default async function Posts() {
  const posts = getSortedPostMetadata();

  return (
    <div>
      {posts.map((p) => (
        <Link key={p.id} href={`/posts/${p.id}`}>
          {p.title}
        </Link>
      ))}
    </div>
  );
}
