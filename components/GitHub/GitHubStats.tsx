"use client";

import { GitHubStats as GitHubStatsType } from "@/lib/github-types";
import { useEffect, useState } from "react";
import LanguageChart from "./LanguageChart";
import TopRepositories from "./TopRepositories";
import ArchivedRepositories from "./ArchivedRepositories";
import ActivitySummary from "./ActivitySummary";
import ProjectTypes from "./ProjectTypes";

interface GitHubStatsProps {
  initialStats?: GitHubStatsType | null;
}

export default function GitHubStats({ initialStats }: GitHubStatsProps) {
  const [stats, setStats] = useState<GitHubStatsType | null>(
    initialStats || null,
  );
  const [loading, setLoading] = useState(!initialStats);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialStats) {
      fetchStats();
    }
  }, [initialStats]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/github-stats");

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <div className="bg-background-secondary animate-pulse rounded-lg p-4">
            <div className="h-24 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">GitHub Contributions</h2>
        <div className="bg-background-secondary rounded-lg p-4">
          <p className="text-red-500">Failed to load GitHub stats: {error}</p>
          <button
            onClick={fetchStats}
            className="bg-primary mt-2 rounded px-4 py-2 text-white hover:opacity-80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

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
}
