import { getAllPostIds } from "@/lib/posts"
import Link from "next/link"

export default async function Posts() {
  const posts = getAllPostIds()

  return (
    <div>
      {posts.map(p => <Link href={`/posts/${p.params.id}`}>{p.params.id}</Link>)}
    </div>
  )
}