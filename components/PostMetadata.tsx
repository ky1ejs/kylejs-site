import { Post } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import RelativeDateLabel from "./RelativeDateLabel";
import calculateReadingTime from "@/lib/reading-time";

const PostLayout = ({ post }: { post: Post }) => (
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
);

export default PostLayout;
