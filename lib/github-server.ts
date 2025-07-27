import { unstable_cache } from "next/cache";
import { GitHubStats } from "./github-types";
import GitHubAPI from "./github-api";

// Internal function that actually fetches the data
async function _fetchGitHubStatsInternal(): Promise<GitHubStats> {
  try {
    const api = new GitHubAPI();
    const stats = await api.fetchGitHubStats();
    return stats;
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);

    // Return minimal fallback data instead of throwing
    return {
      languages: [],
      topRepositories: [],
      archivedRepositories: [],
      activitySummary: {
        totalCommits: 0,
        totalRepositories: 0,
        externalPRs: 0,
        mostActiveMonth: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }),
        contributionDays: 0,
        streakDays: 0,
      },
      projectTypes: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Cached version using Next.js Data Cache with 6-hour revalidation
export const fetchGitHubStats = unstable_cache(
  _fetchGitHubStatsInternal,
  ["github-stats"],
  {
    revalidate: 6 * 60 * 60, // 6 hours in seconds
    tags: ["github-stats"],
  },
);

// Helper function to revalidate GitHub stats cache
export async function revalidateGitHubStats() {
  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag("github-stats");
  } catch (error) {
    console.error("Error revalidating GitHub stats cache:", error);
  }
}
