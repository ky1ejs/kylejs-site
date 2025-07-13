import { NextResponse } from "next/server";
import { getGitHubStats, fetchAndCacheGitHubStats } from "@/lib/github-cache";

export async function GET() {
  try {
    const stats = await getGitHubStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    // Force refresh endpoint
    const stats = await fetchAndCacheGitHubStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error refreshing GitHub stats:", error);
    return NextResponse.json(
      { error: "Failed to refresh GitHub stats" },
      { status: 500 },
    );
  }
}
