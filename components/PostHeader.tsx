import { Post } from "@/lib/posts";
import PostMetadata from "./PostMetadata";

const PostHeader = ({ post }: { post: Post }) => (
  <div className="flex flex-col gap-2">
    <h1>{post.metadata.title}</h1>
    <PostMetadata post={post} />
  </div>
);

export default PostHeader;
