// The posts with the most page views in Cloudflare Web Analytics, read once
// per build. The list is static HTML, so it is only as fresh as the last
// build; `.github/workflows/daily-rebuild.yaml` rebuilds the site every day.
//
// Needs three build variables (Workers Builds: Settings > Build > Variables
// and secrets):
// - CLOUDFLARE_ACCOUNT_ID
// - CLOUDFLARE_WEB_ANALYTICS_SITE_TAG: the site's tag, not the beacon token.
//   It is in the dashboard URL of the site's Web Analytics page
// - CLOUDFLARE_ANALYTICS_API_TOKEN: an API token with Account Analytics: Read
//
// Without them, or when the query fails, the list is empty and the page
// leaves the section out. The build never fails on analytics.

const GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";
const DAY_MS = 24 * 60 * 60 * 1000;
// Cloudflare suggests querying in short intervals rather than one long range
const CHUNK_DAYS = 7;
const REQUEST_TIMEOUT_MS = 10_000;

interface PathViews {
  path: string;
  views: number;
}

/**
 * Post IDs ordered by views, most first. Paths that are not a post in
 * `postIds` are ignored, and views of `/posts/x`, `/posts/x/` and
 * `/posts/x.html` count as one post.
 */
export function rankPosts(rows: PathViews[], postIds: string[], limit: number): string[] {
  const known = new Set(postIds);
  const totals = new Map<string, number>();
  for (const { path, views } of rows) {
    const match = /^\/posts\/([^/?#]+?)(?:\.html)?\/?$/.exec(path);
    if (!match || !known.has(match[1])) continue;
    totals.set(match[1], (totals.get(match[1]) ?? 0) + views);
  }
  return [...totals.entries()]
    .filter(([, views]) => views > 0)
    // Ties fall back to ID order, so a rebuild with the same data gives the same list
    .sort(([a, viewsA], [b, viewsB]) => viewsB - viewsA || a.localeCompare(b))
    .slice(0, limit)
    .map(([id]) => id);
}

/** Splits the `days` before `end` into ranges of at most CHUNK_DAYS. */
export function dateChunks(end: Date, days: number): { start: Date; end: Date }[] {
  const chunks = [];
  for (let offset = 0; offset < days; offset += CHUNK_DAYS) {
    const chunkEnd = new Date(end.getTime() - offset * DAY_MS);
    const length = Math.min(CHUNK_DAYS, days - offset);
    // `datetime_leq` includes its bound, so stop a second short of the next chunk
    const chunkStart = new Date(chunkEnd.getTime() - length * DAY_MS + 1000);
    chunks.push({ start: chunkStart, end: chunkEnd });
  }
  return chunks;
}

function pageViewsQuery(accountTag: string, siteTag: string, start: Date, end: Date) {
  // Values are inlined, not passed as variables, so the query does not depend
  // on the schema's input type names. `readConfig` checks they are plain IDs.
  return `{
  viewer {
    accounts(filter: { accountTag: "${accountTag}" }) {
      rumPageloadEventsAdaptiveGroups(
        filter: {
          siteTag: "${siteTag}"
          datetime_geq: "${start.toISOString()}"
          datetime_leq: "${end.toISOString()}"
        }
        limit: 1000
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          requestPath
        }
      }
    }
  }
}`;
}

interface QueryResponse {
  data?: {
    viewer?: {
      accounts?: {
        rumPageloadEventsAdaptiveGroups?: { count: number; dimensions: { requestPath: string } }[];
      }[];
    };
  } | null;
  errors?: { message: string }[] | null;
}

async function fetchChunk(token: string, query: string): Promise<PathViews[]> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${await response.text()}`);
  }
  const body = (await response.json()) as QueryResponse;
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  const groups = body.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups;
  if (!groups) throw new Error(`unexpected response: ${JSON.stringify(body)}`);
  return groups.map((g) => ({ path: g.dimensions.requestPath, views: g.count }));
}

const ID = /^[0-9a-f]{32}$/i;

function readConfig() {
  const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID;
  const siteTag = process.env.CLOUDFLARE_WEB_ANALYTICS_SITE_TAG;
  const token = process.env.CLOUDFLARE_ANALYTICS_API_TOKEN;
  if (!accountTag || !siteTag || !token) return null;
  if (!ID.test(accountTag) || !ID.test(siteTag)) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_WEB_ANALYTICS_SITE_TAG must be 32 hex characters");
  }
  return { accountTag, siteTag, token };
}

// Every page that shows the list shares one query per build
let cached: Promise<PathViews[]> | undefined;

async function pageViews(days: number): Promise<PathViews[]> {
  const config = readConfig();
  if (!config) {
    console.info("[most-read] Cloudflare analytics variables are not set; leaving out the most read list");
    return [];
  }
  const chunks = dateChunks(new Date(), days);
  const results = await Promise.all(
    chunks.map((c) => fetchChunk(config.token, pageViewsQuery(config.accountTag, config.siteTag, c.start, c.end))),
  );
  return results.flat();
}

/** IDs of the `limit` posts with the most views over the last `days` days. */
export async function getMostReadPostIds(
  postIds: string[],
  { limit = 3, days = 90 }: { limit?: number; days?: number } = {},
): Promise<string[]> {
  cached ??= pageViews(days).catch((error: unknown) => {
    console.warn(`[most-read] Cloudflare analytics query failed; leaving out the most read list: ${error}`);
    return [];
  });
  return rankPosts(await cached, postIds, limit);
}
