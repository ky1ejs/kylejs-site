import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsBaseDirectory = path.join(process.cwd(), "posts");
const publishedDirectory = path.join(postsBaseDirectory, "published");

export type PostMetadata = {
  title: string;
  description: string;
  date: Date;
  shareImage?: string;
};

export type Post = {
  path: string;
  id: string;
  content: string;
  metadata: PostMetadata;
};

function getMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }
  return fs
    .readdirSync(directory)
    .filter(
      (filename) => filename.endsWith(".md") || filename.endsWith(".mdx"),
    );
}

export function getSortedPostMetadata() {
  const fileNames = getMarkdownFiles(publishedDirectory);

  const posts = fileNames.map((fileName) =>
    readPostFromDirectory(fileName, publishedDirectory),
  );

  return posts.sort((a, b) => {
    if (a.metadata.date < b.metadata.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPosts(): Post[] {
  const fileNames = getMarkdownFiles(publishedDirectory);
  return fileNames.map((fileName) =>
    readPostFromDirectory(fileName, publishedDirectory),
  );
}

export function readPostWithId(id: string): Post {
  for (const ext of [".md", ".mdx"]) {
    const fileName = `${id}${ext}`;
    const filePath = path.join(publishedDirectory, fileName);
    if (fs.existsSync(filePath)) {
      return readPostFromDirectory(fileName, publishedDirectory);
    }
  }

  throw new Error(`Post not found: ${id}`);
}

function readPostFromDirectory(fileName: string, directory: string): Post {
  const filePath = path.join(directory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content, data: metadata } = matter(fileContents);

  const fileExtension = fileName.split(".").pop();
  const id = fileName.replace(`.${fileExtension}`, "");

  return {
    path: filePath,
    id,
    content,
    metadata: metadata as PostMetadata,
  };
}
