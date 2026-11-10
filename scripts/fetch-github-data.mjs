// Writes src/data/github.json: activity and stats for every repo named in
// src/content/projects (`activityRepo`, else `repo`). Runs nightly in
// .github/workflows/github-data.yaml, so the site build never calls GitHub.
//
// A repo the token can't read (a private repo in another org, say) keeps its
// previous entry, with a warning, rather than failing the run.
//
// Usage: GITHUB_TOKEN=... node scripts/fetch-github-data.mjs
// Locally: GITHUB_TOKEN=$(gh auth token) node scripts/fetch-github-data.mjs
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import console from "node:console";

const PROJECTS_DIR = "src/content/projects";
const OUT = "src/data/github.json";
const RECENT_DAYS = 90;

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error(
    "Set GITHUB_TOKEN. Locally: GITHUB_TOKEN=$(gh auth token) node scripts/fetch-github-data.mjs",
  );
  process.exit(1);
}

async function graphql(query, variables, { allowNotFound = false } = {}) {
  const res = await globalThis.fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      authorization: `bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  const errors = (body.errors ?? []).filter(
    (e) => !(allowNotFound && e.type === "NOT_FOUND"),
  );
  if (!res.ok || errors.length > 0) {
    throw new Error(
      `GitHub GraphQL failed (${res.status}): ${JSON.stringify(body.errors ?? body)}`,
    );
  }
  return body.data;
}

// Each project's `activityRepo`, else its `repo`
const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith(".md"));
const field = (text, key) =>
  text.match(
    new RegExp(`^${key}:\\s*"?([\\w.-]+\\/[\\w.-]+)"?\\s*$`, "m"),
  )?.[1];
const repos = [];
for (const file of files) {
  const text = await readFile(join(PROJECTS_DIR, file), "utf8");
  const repo = field(text, "activityRepo") ?? field(text, "repo");
  if (repo) repos.push(repo);
}
repos.sort((a, b) => a.localeCompare(b));

const previous = existsSync(OUT) ? JSON.parse(await readFile(OUT, "utf8")) : {};

// Midnight UTC, so runs on the same day ask the same question
const since = new Date(Date.now() - RECENT_DAYS * 86_400_000);
since.setUTCHours(0, 0, 0, 0);

// One aliased field per repo, all in one request
const fields = repos
  .map((full, i) => {
    const [owner, name] = full.split("/");
    return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) {
      stargazerCount
      forkCount
      isArchived
      primaryLanguage { name }
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100) { nodes { committedDate author { name user { login } } } }
          }
        }
      }
    }`;
  })
  .join("\n");

const data = await graphql(`query { ${fields} }`, {}, { allowNotFound: true });

// Dependabot, GitHub Actions and other apps don't count as work on the project
const isBot = (node) =>
  node.author.user?.login.endsWith("[bot]") ||
  /\[bot\]|dependabot/i.test(node.author.name ?? "");

const out = {};
repos.forEach((full, i) => {
  const repo = data[`r${i}`];
  if (!repo) {
    if (!previous[full])
      throw new Error(
        `Can't read ${full}, and there is no previous entry to keep`,
      );
    console.warn(
      `Can't read ${full} with this token; keeping its previous entry`,
    );
    out[full] = previous[full];
    return;
  }
  // Newest first, at most the last 100 commits on the default branch
  const commits = (repo.defaultBranchRef?.target.history.nodes ?? []).filter(
    (n) => !isBot(n),
  );
  const recent = commits.filter(
    (n) => new Date(n.committedDate) >= since,
  ).length;
  out[full] = {
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    archived: repo.isArchived,
    language: repo.primaryLanguage?.name ?? null,
    lastCommit: commits[0]?.committedDate ?? null,
    // Counts to 100 at most; enough to rank by
    [`commits${RECENT_DAYS}d`]: recent,
  };
});

// No timestamp in the file: it only changes, and gets committed, when the data does
await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${repos.length} repos to ${OUT}`);
