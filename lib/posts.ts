import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts/live");

type PostMetadata = {
  title: string;
  date: Date;
};

export function getSortedPostMetadata() {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((filename) => {
    const id = filename.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as PostMetadata),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      id: fileName.replace(/\.md$/, ""),
    };
  });
}

export async function getPostData(id: string) {
  console.log(`id: ${id}`);
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(file);

  return {
    id,
    content,
    metadata: data as PostMetadata,
  };
}
