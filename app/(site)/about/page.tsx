import Bio from "@/app/(site)/about/Bio";
import GitHubStatsServer from "@/components/GitHub/GitHubStatsServer";
import compileMarkdown from "@/lib/markdown-compile";
import { readFileSync } from "fs";
import path from "path";
import { JSX } from "react";

export default async function About() {
  const Intro = await readAboutFile("intro.md");
  const Professional = await readAboutFile("professional.mdx");
  const Personal = await readAboutFile("personal.md");

  return (
    <div>
      <Intro />
      <Bio
        Professional={<Professional />}
        Personal={<Personal />}
        GitHubStats={<GitHubStatsServer />}
      />
    </div>
  );
}

async function readAboutFile(name: string): Promise<() => JSX.Element> {
  const contentDirectory = path.join(process.cwd(), "content");
  const p = `${contentDirectory}/about/${name}`;
  const markdown = readFileSync(p, "utf8");
  return await compileMarkdown(markdown);
}
