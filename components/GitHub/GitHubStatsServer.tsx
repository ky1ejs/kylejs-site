import { Suspense } from "react";
import { fetchGitHubStats } from "@/lib/github-server";
import LanguageChart from "./LanguageChart";
import TopRepositories from "./TopRepositories";
import ArchivedRepositories from "./ArchivedRepositories";
import ActivitySummary from "./ActivitySummary";
import ProjectTypes from "./ProjectTypes";

// Loading skeleton component
function GitHubStatsLoading() {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">GitHub Contributions</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-background-secondary animate-pulse rounded-lg p-4">
            <div className="h-32 rounded bg-gray-300"></div>
          </div>
          <div className="bg-background-secondary animate-pulse rounded-lg p-4">
            <div className="h-32 rounded bg-gray-300"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-background-secondary animate-pulse rounded-lg p-4">
            <div className="h-32 rounded bg-gray-300"></div>
          </div>
          <div className="bg-background-secondary animate-pulse rounded-lg p-4">
            <div className="h-32 rounded bg-gray-300"></div>
          </div>
        </div>
        <div className="bg-background-secondary animate-pulse rounded-lg p-4">
          <div className="h-24 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}

// Server component that fetches and renders GitHub stats
async function GitHubStatsContent() {
  try {
    const stats = await fetchGitHubStats();

    return (
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">GitHub Contributions</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LanguageChart languages={stats.languages} />
            <ActivitySummary activity={stats.activitySummary} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TopRepositories repositories={stats.topRepositories} />
            <ProjectTypes projectTypes={stats.projectTypes} />
          </div>

          {stats.archivedRepositories &&
            stats.archivedRepositories.length > 0 && (
              <ArchivedRepositories repositories={stats.archivedRepositories} />
            )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering GitHub stats:", error);

    return (
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">GitHub Contributions</h2>
        <div className="bg-background-secondary rounded-lg p-4">
          <p className="text-red-500">Failed to load GitHub stats.</p>
          <p className="mt-2 text-sm text-gray-500">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
}

// Main export with Suspense boundary
export default function GitHubStatsServer() {
  return (
    <Suspense fallback={<GitHubStatsLoading />}>
      <GitHubStatsContent />
    </Suspense>
  );
}
