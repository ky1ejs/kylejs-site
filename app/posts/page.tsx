import { getSortedPostMetadata } from "@/lib/posts";
import Link from "next/link";
import PostMetadata from "@/components/PostMetadata";

const WipComponent = () => (
  <div className="roudned my-4 rounded-md border-4 border-yellow-300 px-4 py-2 text-center text-sm text-gray-500">
    🚧 Construction in progress - this blog site is still a WIP
  </div>
);

const Intro = () => (
  <div>
    <h2>Welcome</h2>
    <p>
      The older I get the more I want to write to process and remember my
      experiences and learning.
    </p>
    <p>
      The funny paradox about{" "}
      <span className="italic">living in the moment</span> is that you're likely
      not to remember it. There's some truth to the whole "if there aren't any
      photos (or Instagram post), did it really happen".
    </p>
    <p>
      On this blog I place my projects, learnings and thinking out in the open
      in an effort to connect with others.
    </p>
    <p>Please reach out to me if you see something you like!</p>
    <h2>Pinned Posts</h2>
    <h2>Latest Posts</h2>
    <h2>Categories</h2>
    <ul>
      <li>Book Reviews</li>
      <li>Projects (how I built this)</li>
      <li>Way of working</li>
      <li>Travel / Trips</li>
      <li>Films I love</li>
    </ul>
  </div>
);

export default async function Posts() {
  const posts = getSortedPostMetadata();

  return (
    <div className="mt-4">
      <WipComponent />
      <Intro />
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
