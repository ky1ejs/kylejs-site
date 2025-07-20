"use client";

import { GitHubLanguageStats } from "@/lib/github-types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface LanguageChartProps {
  languages: GitHubLanguageStats[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: { name: string; value: number; color: string };
  }>;
}

interface LegendProps {
  payload?: Array<{ value: string; color: string }>;
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
    name: lang.name,
    value: lang.percentage,
    color: lang.color,
  }));

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background rounded-lg border p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: LegendProps) => {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {payload?.slice(0, 6).map((entry, index: number) => (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
            <span className="text-gray-500">
              ({data.find((d) => d.name === entry.value)?.value}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-background-secondary rounded-lg p-4">
      <h3 className="mb-3 text-lg font-semibold">Programming Languages</h3>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
