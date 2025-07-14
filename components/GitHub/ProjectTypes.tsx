"use client";

import { GitHubProjectType } from "@/lib/github-types";

interface ProjectTypesProps {
  projectTypes: GitHubProjectType[];
}

export default function ProjectTypes({ projectTypes }: ProjectTypesProps) {
  if (!projectTypes || projectTypes.length === 0) {
    return (
      <div className="rounded-lg bg-background-secondary p-4">
        <h3 className="mb-3 text-lg font-semibold">Project Categories</h3>
        <p className="text-gray-500">No project data available</p>
      </div>
    );
  }

  const categoryIcons: Record<string, string> = {
    "Web Development": "🌐",
    "Mobile Development": "📱",
    "DevOps & Tools": "🛠️",
    "Data & Analytics": "📊",
    "Libraries & Frameworks": "📦",
    Other: "🔧",
  };

  return (
    <div className="rounded-lg bg-background-secondary p-4">
      <h3 className="mb-3 text-lg font-semibold">Project Categories</h3>

      <div className="space-y-3">
        {projectTypes.map((type, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
              <span className="text-lg">
                {categoryIcons[type.category] || "📁"}
              </span>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type.category}</span>
                  <span className="text-xs text-gray-500">
                    {type.count} project{type.count !== 1 ? "s" : ""} (
                    {type.percentage}%)
                  </span>
                </div>

                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${type.percentage}%` }}
                  />
                </div>

                {type.examples.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Examples: {type.examples.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
