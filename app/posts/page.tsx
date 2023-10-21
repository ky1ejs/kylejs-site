import { getSortedPostMetadata } from "@/lib/posts";
import Link from "next/link";
import PostMetadata from "@/components/PostMetadata";
import BlogWipNotice from "@/components/BlogWipNotice";

const Intro = () => (
  <div>
    <h2>On writing</h2>
    <p>
      Writing is an incredibly important thing to practice: You can think
      clearer. Maximise the reward gained from endeavours you make; remembering
      and revisiting them. Share your experiences and connect over them with
      others.
    </p>
    <p>
      When you can write well, you&apos;re more likely to communicate well in
      all forms and succeed in influencing others.
    </p>
    <p>
      The funny paradox about{" "}
      <span className="italic">living in the moment</span> is that you&apos;re
      likely not to remember it. There&apos;s some truth to the whole &quot;if
      there aren&apos;t any photos (or Instagram post), did it really
      happen&quot;. This is why I try to capture most things I do in some way.
    </p>
    <h2>What to expect</h2>
    <p>
      On this blog I place my projects, learnings and thinking out in the open
      in an effort to connect with others.
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
      <BlogWipNotice />
      <Intro />
      {posts.map((p) => (
        <Link key={p.id} href={`/posts/${p.id}`}>
          <div className="bg-gray-200 py-2 transition hover:text-primary sm:bg-transparent">
            <h2 className="p-0 text-xl">{p.metadata.title}</h2>
            <PostMetadata post={p} showAvatar={false} />
          </div>
        </Link>
      ))}
    </div>
  );
}
