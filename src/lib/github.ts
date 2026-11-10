import data from "../data/github.json";
import type { ProjectStatus } from "../design/components";

/** One repo's entry in src/data/github.json, written by scripts/fetch-github-data.mjs. */
export interface RepoStats {
  stars: number;
  forks: number;
  archived: boolean;
  language: string | null;
  /** ISO date of the newest non-bot commit on the default branch. */
  lastCommit: string | null;
  /** Non-bot commits in the last 90 days, up to 100. */
  commits90d: number;
}

const stats: Record<string, RepoStats> = data;

interface ProjectData {
  status?: "experiment" | "archived";
  repo?: string;
  activityRepo?: string;
}

/** Stars below this aren't worth showing. */
const MIN_STARS = 5;
/** A project with no commit for this long shows as parked. */
const PARKED_AFTER_DAYS = 183;

function repoStats(project: ProjectData): RepoStats | undefined {
  const repo = project.activityRepo ?? project.repo;
  return repo ? stats[repo] : undefined;
}

/**
 * The status to show:
 * - archived: the repo is archived on GitHub, or the frontmatter says so
 * - parked: no commit in the last six months
 * - experiment: the frontmatter says so, and it has recent commits
 * - active: anything else with recent commits
 * A project without GitHub data shows its frontmatter status, else active.
 */
export function statusFor(
  override: "experiment" | "archived" | undefined,
  s: RepoStats | undefined,
  now = new Date(),
): ProjectStatus {
  if (s?.archived || override === "archived") return "archived";
  if (s) {
    const days = s.lastCommit
      ? (now.getTime() - Date.parse(s.lastCommit)) / 86_400_000
      : Infinity;
    if (days > PARKED_AFTER_DAYS) return "parked";
  }
  return override ?? "active";
}

/** For sorting, most active first: recent commits, then the newest commit. */
export function compareStats(
  a: RepoStats | undefined,
  b: RepoStats | undefined,
): number {
  const last = (s?: RepoStats) =>
    s?.lastCommit ? Date.parse(s.lastCommit) : 0;
  return (b?.commits90d ?? 0) - (a?.commits90d ?? 0) || last(b) - last(a);
}

const MONTH = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * "Swift · 61★ · Mar 2026": language, stars when there are a few, and the
 * month of the last commit. A month renders the same for every reader, so it
 * needs no script before paint.
 */
export function metaFor(s: RepoStats | undefined): string | undefined {
  if (!s) return undefined;
  const parts = [
    s.language,
    s.stars >= MIN_STARS ? `${s.stars}★` : null,
    s.lastCommit ? MONTH.format(new Date(s.lastCommit)) : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export const displayStatus = (p: ProjectData) =>
  statusFor(p.status, repoStats(p));
export const compareActivity = (a: ProjectData, b: ProjectData) =>
  compareStats(repoStats(a), repoStats(b));
export const repoMeta = (p: ProjectData) => metaFor(repoStats(p));

/** ISO date of the last commit, or "" without one. */
export const lastCommitAt = (p: ProjectData) => repoStats(p)?.lastCommit ?? "";
