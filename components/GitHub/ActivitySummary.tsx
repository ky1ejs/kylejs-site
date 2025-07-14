"use client";

import { GitHubActivitySummary } from "@/lib/github-types";

interface ActivitySummaryProps {
  activity: GitHubActivitySummary;
}

export default function ActivitySummary({ activity }: ActivitySummaryProps) {
  const stats = [
    {
      label: "Total Commits",
      value: activity.totalCommits.toLocaleString(),
      icon: "📝",
    },
    {
      label: "Public Repositories",
      value: activity.totalRepositories.toString(),
      icon: "📚",
    },
    {
      label: "External PRs",
      value: activity.externalPRs.toString(),
      icon: "🔀",
    },
    {
      label: "Contribution Days",
      value: activity.contributionDays.toString(),
      icon: "📅",
    },
    {
      label: "Longest Streak",
      value: `${activity.streakDays} days`,
      icon: "🔥",
    },
    {
      label: "Most Active Month",
      value: activity.mostActiveMonth,
      icon: "⭐",
    },
  ];

  return (
    <div className="rounded-lg bg-background-secondary p-4">
      <h3 className="mb-3 text-lg font-semibold">Activity Summary</h3>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <span className="font-semibold text-primary">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
