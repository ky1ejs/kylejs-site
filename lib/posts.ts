import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostMetadata = {
  title: string;
  date: Date;
  published: boolean;
};

export type Post = {
  path: string;
  id: string;
  content: string;
  metadata: PostMetadata;
};

export function getSortedPostMetadata() {
  const fileNames = fs.readdirSync(postsDirectory);

  const mdFiles = fileNames.filter(
    (filename) => filename.endsWith(".md") || filename.endsWith(".mdx"),
  );

  const posts = mdFiles
    .map(readPostWithFileName)
    .filter((post) => post.metadata.published);

  return posts.sort((a, b) => {
    if (a.metadata.date < b.metadata.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(readPostWithFileName);
}

export function readPostWithId(id: string): Post {
  try {
    return readPostWithFileName(`${id}.md`);
  } catch {
    return readPostWithFileName(`${id}.mdx`);
  }
}

function readPostWithFileName(fileName: string): Post {
  const path = `${postsDirectory}/${fileName}`;
  const fileContents = fs.readFileSync(path, "utf8");
  const { content, data: metadata } = matter(fileContents);

  const fileExtension = path.split(".").pop();
  const id = fileName.replace(`.${fileExtension}`, "");

  return {
    path,
    id,
    content,
    metadata: metadata as PostMetadata,
  };
}
