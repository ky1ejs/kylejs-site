"use client";

import { GitHubRepository } from "@/lib/github-types";

interface ArchivedRepositoriesProps {
  repositories: GitHubRepository[];
}

export default function ArchivedRepositories({
  repositories,
}: ArchivedRepositoriesProps) {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-background-secondary rounded-lg p-4">
        <h3 className="mb-3 text-lg font-semibold">Archived Repositories</h3>
        <p className="text-gray-500">No archived repositories</p>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary rounded-lg p-4">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        📦 Archived Repositories
        <span className="text-sm font-normal text-gray-500">
          ({repositories.length})
        </span>
      </h3>

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
                  className="hover:text-primary font-medium text-gray-600 hover:underline"
                >
                  {repo.name}
                </a>

                {repo.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {repo.description}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
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

                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    Archived
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
