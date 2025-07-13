"use client";

import { GitHubRepository } from "@/lib/github-types";

interface TopRepositoriesProps {
  repositories: GitHubRepository[];
}

export default function TopRepositories({
  repositories,
}: TopRepositoriesProps) {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="rounded-lg bg-background-secondary p-4">
        <h3 className="mb-3 text-lg font-semibold">Top Repositories</h3>
        <p className="text-gray-500">No repositories available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-background-secondary p-4">
      <h3 className="mb-3 text-lg font-semibold">Top Repositories</h3>

      <div className="space-y-3">
        {repositories.map((repo, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {repo.name}
                </a>

                {repo.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {repo.description}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      {repo.language}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    ⭐ {repo.stars}
                  </span>

                  {repo.forks > 0 && (
                    <span className="flex items-center gap-1">
                      🍴 {repo.forks}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3">
        <a
          href={`https://github.com/ky1ejs?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View all repositories →
        </a>
      </div>
    </div>
  );
}
