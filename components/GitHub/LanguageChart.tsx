"use client";

import { GitHubLanguageStats } from "@/lib/github-types";
import { AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";

interface LanguageChartProps {
  languages: GitHubLanguageStats[];
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  if (!languages || languages.length === 0) {
    return (
      <div className="bg-background-secondary rounded-lg p-4">
        <h3 className="mb-3 text-lg font-semibold">Programming Languages</h3>
        <p className="text-gray-500">No language data available</p>
      </div>
    );
  }

  const data = languages.map((lang) => ({
    language: lang.name,
    percentage: lang.percentage,
    color: lang.color,
  }));

  const options: AgChartOptions = {
    data,
    series: [
      {
        type: "donut",
        calloutLabelKey: "language",
        angleKey: "percentage",
      },
    ],
    legend: {
      enabled: false,
    },
  };

  return (
    <div className="bg-background-secondary rounded-lg p-4">
      <h3 className="mb-3 text-lg font-semibold">Programming Languages</h3>

      <div className="h-48 w-full">
        <AgCharts options={options} />
      </div>
    </div>
  );
}
