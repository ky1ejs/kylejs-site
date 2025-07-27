"use client";

import { GitHubLanguageStats } from "@/lib/github-types";
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

  // Using any type due to complex ag-charts type definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    data,
    width: 400,
    height: 200,
    background: {
      fill: "transparent",
    },
    series: [
      {
        type: "pie",
        angleKey: "percentage",
        categoryKey: "language",
        innerRadiusRatio: 0.5,
        fills: data.map((item) => item.color),
        tooltip: {
          renderer: ({
            datum,
          }: {
            datum: { language: string; percentage: number; color: string };
          }) => ({
            content: `${datum.language}: ${datum.percentage}%`,
          }),
        },
        label: {
          enabled: false,
        },
      },
    ],
    legend: {
      enabled: false, // Disable built-in legend, use custom one
    },
  };

  const legendItems = data.slice(0, 6);

  return (
    <div className="bg-background-secondary rounded-lg p-4">
      <h3 className="mb-3 text-lg font-semibold">Programming Languages</h3>

      <div className="h-48">
        <AgCharts options={options} />
      </div>

      {/* Custom legend for better styling */}
      <div className="mt-4 flex flex-wrap gap-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.language}</span>
            <span className="text-gray-500">({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
