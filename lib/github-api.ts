import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";
import {
  GitHubStats,
  GitHubLanguageStats,
  GitHubRepository,
  GitHubActivitySummary,
  GitHubProjectType,
  OctokitRepository,
  ContributionsCollection,
  GitHubGraphQLResponse,
  GitHubSearchResponse,
} from "./github-types";

// Language colors from GitHub's linguist
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Swift: "#fa7343",
  Java: "#b07219",
  Python: "#3572A5",
  Go: "#00ADD8",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  Scala: "#c22d40",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Markdown: "#083fa1",
  YAML: "#cb171e",
  JSON: "#292929",
  SQL: "#e38c00",
};

class GitHubAPI {
  private octokit: Octokit;
  private graphqlClient: typeof graphql;
  private username: string;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    this.username = process.env.GITHUB_USERNAME || "ky1ejs";

    if (!token) {
      throw new Error("GITHUB_TOKEN environment variable is required");
    }

    this.octokit = new Octokit({
      auth: token,
    });

    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
  }

  async fetchGitHubStats(): Promise<GitHubStats> {
    try {
      const [repositories, contributionData, externalPRs] = await Promise.all([
        this.fetchRepositories(),
        this.fetchContributionData(),
        this.fetchExternalPRs(),
      ]);

      const languages = this.calculateLanguageStats(
        repositories as OctokitRepository[],
      );
      const topRepositories = this.getTopRepositories(
        repositories as OctokitRepository[],
      );
      const archivedRepositories = this.getArchivedRepositories(
        repositories as OctokitRepository[],
      );
      const activitySummary = this.calculateActivitySummary(
        contributionData,
        repositories as OctokitRepository[],
        externalPRs,
      );
      const projectTypes = this.categorizeProjects(
        repositories as OctokitRepository[],
      );

      return {
        languages,
        topRepositories,
        archivedRepositories,
        activitySummary,
        projectTypes,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      throw error;
    }
  }

  private async fetchRepositories() {
    const { data } = await this.octokit.repos.listForUser({
      username: this.username,
      type: "owner",
      sort: "updated",
      per_page: 100,
    });

    // Get language data for each repository
    const repositoriesWithLanguages = await Promise.all(
      data.map(async (repo) => {
        try {
          const { data: languages } = await this.octokit.repos.listLanguages({
            owner: this.username,
            repo: repo.name,
          });

          return {
            ...repo,
            languages,
          };
        } catch (error) {
          console.warn(`Failed to fetch languages for ${repo.name}:`, error);
          return {
            ...repo,
            languages: {},
          };
        }
      }),
    );

    return repositoriesWithLanguages;
  }

  private async fetchUserCreationDate(): Promise<Date> {
    const query = `
      query($username: String!) {
        user(login: $username) {
          createdAt
        }
      }
    `;

    try {
      const response = (await this.graphqlClient(query, {
        username: this.username,
      })) as { user: { createdAt: string } };

      return new Date(response.user.createdAt);
    } catch (error) {
      console.error("Error fetching user creation date:", error);
      // Default to 10 years ago if we can't get the creation date
      const fallbackDate = new Date();
      fallbackDate.setFullYear(fallbackDate.getFullYear() - 10);
      return fallbackDate;
    }
  }

  private async fetchContributionData() {
    try {
      const createdAt = await this.fetchUserCreationDate();
      const currentYear = new Date().getFullYear();
      const startYear = createdAt.getFullYear();

      const allContributions: ContributionsCollection = {
        totalCommitContributions: 0,
        contributionCalendar: {
          totalContributions: 0,
          weeks: [],
        },
      };

      // Fetch contributions for each year from signup to current year
      for (let year = startYear; year <= currentYear; year++) {
        const fromDate = new Date(`${year}-01-01`);
        const toDate = new Date(`${year}-12-31`);

        // For the signup year, start from the actual creation date
        if (year === startYear) {
          fromDate.setTime(createdAt.getTime());
        }

        // For the current year, end at today
        if (year === currentYear) {
          toDate.setTime(new Date().getTime());
        }

        const query = `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                totalCommitContributions
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `;

        try {
          const response = (await this.graphqlClient(query, {
            username: this.username,
            from: fromDate.toISOString(),
            to: toDate.toISOString(),
          })) as GitHubGraphQLResponse;

          const yearData = response.user.contributionsCollection;

          // Accumulate totals
          allContributions.totalCommitContributions +=
            yearData.totalCommitContributions || 0;
          allContributions.contributionCalendar.totalContributions +=
            yearData.contributionCalendar?.totalContributions || 0;

          // Merge weeks data
          if (yearData.contributionCalendar?.weeks) {
            allContributions.contributionCalendar.weeks.push(
              ...yearData.contributionCalendar.weeks,
            );
          }
        } catch (error) {
          console.warn(
            `Failed to fetch contributions for year ${year}:`,
            error,
          );
          // Continue with other years even if one fails
        }
      }

      return allContributions;
    } catch (error) {
      console.error("Error fetching contribution data:", error);
      // Return minimal data structure if GraphQL fails
      return {
        totalCommitContributions: 0,
        contributionCalendar: {
          totalContributions: 0,
          weeks: [],
        },
      };
    }
  }

  private calculateLanguageStats(
    repositories: OctokitRepository[],
  ): GitHubLanguageStats[] {
    const languageTotals: Record<string, number> = {};

    repositories
      .filter((repo) => !repo.fork && !repo.archived) // Exclude forks and archived repos from language stats
      .forEach((repo) => {
        if (repo.languages) {
          Object.entries(repo.languages).forEach(([language, bytes]) => {
            languageTotals[language] =
              (languageTotals[language] || 0) + (bytes as number);
          });
        }
      });

    const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);

    if (totalBytes === 0) {
      return [];
    }

    return Object.entries(languageTotals)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 100 * 10) / 10,
        color: LANGUAGE_COLORS[name] || "#8e8e93",
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10); // Top 10 languages
  }

  private getTopRepositories(
    repositories: OctokitRepository[],
  ): GitHubRepository[] {
    return repositories
      .filter((repo) => !repo.fork && !repo.archived) // Exclude forks and archived repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language || null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        lastUpdated: repo.updated_at,
      }));
  }

  private getArchivedRepositories(
    repositories: OctokitRepository[],
  ): GitHubRepository[] {
    return repositories
      .filter((repo) => repo.archived && !repo.fork) // Only archived, non-fork repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .map((repo) => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language || null,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        lastUpdated: repo.updated_at,
      }));
  }

  private calculateActivitySummary(
    contributionData: ContributionsCollection,
    repositories: OctokitRepository[],
    externalPRs: number,
  ): GitHubActivitySummary {
    const totalCommits = contributionData.totalCommitContributions || 0;
    const totalRepositories = repositories.filter(
      (repo) => !repo.fork && !repo.archived,
    ).length;

    // Calculate contribution days and streak
    const weeks = contributionData.contributionCalendar?.weeks || [];
    let contributionDays = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    const allDays = weeks.flatMap((week) => week.contributionDays);
    // Sort by date to ensure chronological order across multiple years
    allDays.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    for (const day of allDays) {
      if (day.contributionCount > 0) {
        contributionDays++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Find most active month (simplified)
    const monthlyContributions: Record<string, number> = {};
    allDays.forEach((day) => {
      const month = new Date(day.date).toISOString().slice(0, 7);
      monthlyContributions[month] =
        (monthlyContributions[month] || 0) + day.contributionCount;
    });

    const mostActiveMonth =
      Object.entries(monthlyContributions).sort(
        ([, a], [, b]) => b - a,
      )[0]?.[0] || new Date().toISOString().slice(0, 7);

    return {
      totalCommits,
      totalRepositories,
      externalPRs,
      mostActiveMonth: new Date(mostActiveMonth + "-01").toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
        },
      ),
      contributionDays,
      streakDays: maxStreak,
    };
  }

  private async fetchExternalPRs(): Promise<number> {
    try {
      const query = `
        query($username: String!, $searchQuery: String!) {
          search(query: $searchQuery, type: ISSUE, first: 100) {
            issueCount
            edges {
              node {
                ... on PullRequest {
                  repository {
                    owner {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = (await this.graphqlClient(query, {
        username: this.username,
        searchQuery: `author:${this.username} type:pr`,
      })) as GitHubSearchResponse;

      const externalPRs = response.search.edges.filter(
        (edge) => edge.node.repository.owner.login !== this.username,
      );

      return externalPRs.length;
    } catch (error) {
      console.error("Error fetching external PRs:", error);
      return 0;
    }
  }

  private categorizeProjects(
    repositories: OctokitRepository[],
  ): GitHubProjectType[] {
    const categories: Record<string, string[]> = {
      "Web Development": [],
      "Mobile Development": [],
      "DevOps & Tools": [],
      "Data & Analytics": [],
      "Libraries & Frameworks": [],
      Other: [],
    };

    repositories
      .filter((repo) => !repo.fork && !repo.archived)
      .forEach((repo) => {
        const name = repo.name.toLowerCase();
        const description = (repo.description || "").toLowerCase();
        const language = repo.language?.toLowerCase() || "";

        if (
          language === "swift" ||
          language === "objective-c" ||
          name.includes("ios") ||
          description.includes("ios")
        ) {
          categories["Mobile Development"].push(repo.name);
        } else if (
          language === "typescript" ||
          language === "javascript" ||
          name.includes("web") ||
          name.includes("react") ||
          name.includes("next") ||
          description.includes("web")
        ) {
          categories["Web Development"].push(repo.name);
        } else if (
          language === "dockerfile" ||
          name.includes("docker") ||
          name.includes("kubernetes") ||
          name.includes("deploy") ||
          description.includes("devops")
        ) {
          categories["DevOps & Tools"].push(repo.name);
        } else if (
          language === "python" ||
          name.includes("data") ||
          name.includes("analytics") ||
          description.includes("data")
        ) {
          categories["Data & Analytics"].push(repo.name);
        } else if (
          name.includes("lib") ||
          name.includes("framework") ||
          description.includes("library") ||
          description.includes("framework")
        ) {
          categories["Libraries & Frameworks"].push(repo.name);
        } else {
          categories.Other.push(repo.name);
        }
      });

    const totalProjects = repositories.filter(
      (repo) => !repo.fork && !repo.archived,
    ).length;

    return Object.entries(categories)
      .filter(([, repos]) => repos.length > 0)
      .map(([category, repos]) => ({
        category,
        count: repos.length,
        percentage: Math.round((repos.length / totalProjects) * 100),
        examples: repos.slice(0, 3), // Top 3 examples
      }))
      .sort((a, b) => b.count - a.count);
  }
}

export default GitHubAPI;
