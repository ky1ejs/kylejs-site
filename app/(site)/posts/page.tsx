import { getSortedPostMetadata } from "@/lib/posts";
import Link from "next/link";
import PostMetadata from "@/components/PostMetadata";

const Intro = () => (
  <div>
    <h2>My blog – what to expect</h2>
    <p>
      On this blog I share my projects, learnings and thinking out in the open
      in an effort to connect with others.
    </p>
    <p>
      You can read more about my thoughts on blogging/writing in <Link href="/posts/why-blog">this post</Link>.
    </p>
    <p>
      Please reach out to me if you see something you like! My socials{" "}
      <Link href="/">are on the home page.</Link>
    </p>
    <h2>Posts</h2>
    {/* <h2>Pinned Posts</h2> */}
    {/* <h2>Latest Posts</h2> */}
    {/* <h2>Categories</h2> */}
    {/* <ul> */}
    {/* <li>Book Reviews</li> */}
    {/* <li>Projects (how I built this)</li> */}
    {/* <li>Way of working</li> */}
    {/* <li>Travel / Trips</li> */}
    {/* <li>Films I love</li> */}
    {/* </ul> */}
  </div>
);

export default async function Posts() {
  const posts = getSortedPostMetadata();

  return (
    <div className="mt-4">
      <Intro />
      {posts.map((p) => (
        <div key={p.id}>
          <Link href={`/posts/${p.id}`} className="hover:text-primary">
            <h2 className="p-0 text-xl">{p.metadata.title}</h2>
          </Link>
          <div className="bg-gray-200 pb-2 hover:text-primary sm:bg-transparent">
            <PostMetadata post={p} showAvatar={false} />
          </div>
        </div>
      ))}
    </div>
  );
}
