export interface GitHubLanguageStats {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface GitHubRepository {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  lastUpdated: string;
  contributions?: number;
}

export interface GitHubActivitySummary {
  totalCommits: number;
  totalRepositories: number;
  externalPRs: number;
  mostActiveMonth: string;
  contributionDays: number;
  streakDays: number;
}

export interface GitHubProjectType {
  category: string;
  count: number;
  percentage: number;
  examples: string[];
}

export interface GitHubStats {
  languages: GitHubLanguageStats[];
  topRepositories: GitHubRepository[];
  archivedRepositories: GitHubRepository[];
  activitySummary: GitHubActivitySummary;
  projectTypes: GitHubProjectType[];
  lastUpdated: string;
}

export interface CacheData {
  data: GitHubStats;
  timestamp: number;
  expiresAt: number;
}

// Internal types for API responses
export interface OctokitRepository {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null | undefined;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  languages?: Record<string, number>;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionsCollection {
  totalCommitContributions: number;
  contributionCalendar: ContributionCalendar;
}

export interface GitHubGraphQLResponse {
  user: {
    contributionsCollection: ContributionsCollection;
  };
}

export interface GitHubSearchResponse {
  search: {
    edges: Array<{
      node: {
        repository: {
          owner: {
            login: string;
          };
        };
      };
    }>;
  };
}
