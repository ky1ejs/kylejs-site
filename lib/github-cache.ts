import { promises as fs } from "fs";
import path from "path";
import { GitHubStats, CacheData } from "./github-types";
import GitHubAPI from "./github-api";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "github-stats.json");
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export async function getCachedGitHubStats(): Promise<CacheData | null> {
  try {
    const cached = await fs.readFile(CACHE_FILE, "utf8");
    return JSON.parse(cached);
  } catch {
    // File doesn't exist or is invalid
    return null;
  }
}

export async function setCachedGitHubStats(data: GitHubStats): Promise<void> {
  const cacheData: CacheData = {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_TTL,
  };

  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error("Failed to cache GitHub stats:", error);
    throw error;
  }
}

export function isExpired(cached: CacheData): boolean {
  return Date.now() > cached.expiresAt;
}

export async function getGitHubStats(): Promise<GitHubStats> {
  const cached = await getCachedGitHubStats();

  // Return cached data if valid and not expired
  if (cached && !isExpired(cached)) {
    return cached.data;
  }

  // If expired but has cached data, return stale data and refresh in background
  if (cached && isExpired(cached)) {
    // Start background refresh but don't wait
    refreshGitHubStatsInBackground().catch((error) => {
      console.error("Background refresh failed:", error);
    });

    return cached.data;
  }

  // No cached data or first time - fetch fresh data
  return await fetchAndCacheGitHubStats();
}

export async function fetchAndCacheGitHubStats(): Promise<GitHubStats> {
  try {
    const api = new GitHubAPI();
    const stats = await api.fetchGitHubStats();
    await setCachedGitHubStats(stats);
    return stats;
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);

    // Try to return stale cached data as fallback
    const cached = await getCachedGitHubStats();
    if (cached) {
      console.log("Returning stale cached data due to API error");
      return cached.data;
    }

    throw error;
  }
}

async function refreshGitHubStatsInBackground(): Promise<void> {
  try {
    await fetchAndCacheGitHubStats();
    console.log("Background refresh of GitHub stats completed");
  } catch (error) {
    console.error("Background refresh failed:", error);
  }
}
