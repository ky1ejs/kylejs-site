import { Post } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import RelativeDateLabel from "./RelativeDateLabel";
import calculateReadingTime from "@/lib/reading-time";

const PostMetadata = ({
  post,
  showAvatar,
}: {
  post: Post;
  showAvatar?: boolean;
}) => (
  <div className="flex items-center divide-x-[1px] divide-muted text-sm text-muted">
    <div className="pr-2">
      Written by{" "}
      <Link href="/">
        {(showAvatar ?? true) && (
          <Image
            src="/me.jpg"
            width={30}
            height={30}
            alt="Profile picture of Kyle Satti"
            className="mr-2 inline rounded-full transition hover:scale-110"
          />
        )}
        <span className="transition hover:text-primary">Kyle Satti</span>
      </Link>
    </div>
    <div className="px-2">{calculateReadingTime(post.content)}</div>
    <div className="pl-2">
      <RelativeDateLabel date={post.metadata.date} />
    </div>
  </div>
);

export default PostMetadata;
