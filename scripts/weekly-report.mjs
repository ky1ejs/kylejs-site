// Emails a weekly report on kylejs.me: traffic from Cloudflare Web Analytics,
// and what changed on main. Cloudflare injects the Web Analytics beacon into
// pages at its edge (automatic setup), so the site has no analytics code. Run by .github/workflows/weekly-report.yaml.
//
//   node scripts/weekly-report.mjs --dry-run         print the plain-text email
//   node scripts/weekly-report.mjs --dry-run --html  print the HTML email
//   node scripts/weekly-report.mjs                   send it
//   --end=2026-11-02                                 report the 7 days before this UTC date
//
// Traffic needs CLOUDFLARE_API_TOKEN (Account Analytics: Read),
// CLOUDFLARE_ACCOUNT_ID and CF_WEB_ANALYTICS_SITE_TAG. Without them a dry run
// still prints the activity section. Performance comes from the same Web
// Analytics site. CLOUDFLARE_ZONE_ID is optional and adds
// daily unique IPs from the zone's edge logs (the token then also needs Zone
// Analytics: Read). Sending needs SMTP_USERNAME and
// SMTP_PASSWORD (a Gmail app password); REPORT_TO defaults to SMTP_USERNAME.
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import console from "node:console";
import process from "node:process";

const { fetch } = globalThis;

const SITE_HOST = "kylejs.me";
const SITE_URL = `https://${SITE_HOST}`;
const BLOG_DIR = "src/content/blog";
const DAY = 86_400_000;
const TOP = 10;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const printHtml = args.includes("--html");
const endArg = args.find((a) => a.startsWith("--end="))?.slice("--end=".length);

// The window is the 7 whole UTC days before `end`. Run on a Monday, that is
// Monday to Sunday of the week just gone.
const end = endArg
  ? new Date(`${endArg}T00:00:00Z`)
  : startOfUtcDay(new Date());
if (Number.isNaN(end.getTime())) fail(`--end=${endArg}: want YYYY-MM-DD`);
const start = new Date(end.getTime() - 7 * DAY);
const prevStart = new Date(start.getTime() - 7 * DAY);

function startOfUtcDay(d) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

// --- Posts ------------------------------------------------------------------

// Reads title and date from each post's frontmatter. Enough YAML for the two
// scalar fields src/content.config.ts requires; the build validates the rest.
async function readPosts() {
  const posts = new Map();
  for (const file of await readdir(BLOG_DIR)) {
    const match = file.match(/^(.+)\.mdx?$/);
    if (!match) continue;
    const source = await readFile(join(BLOG_DIR, file), "utf8");
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const field = (name) =>
      frontmatter
        .match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]
        .trim()
        .replace(/^(["'])(.*)\1$/, "$2");
    posts.set(match[1], {
      id: match[1],
      file,
      title: field("title") ?? match[1],
      date: field("date"),
    });
  }
  return posts;
}

function pageLabel(path, posts) {
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return "Home";
  if (clean === "/about") return "About";
  if (clean === "/posts") return "All posts";
  const post = posts.get(clean.match(/^\/posts\/([^/]+)$/)?.[1]);
  return post ? post.title : clean;
}

// --- Traffic ----------------------------------------------------------------

// Cloudflare Web Analytics over GraphQL. `bot: 0` drops the page loads
// Cloudflare flags as automated.
async function readTraffic() {
  const {
    CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ACCOUNT_ID,
    CF_WEB_ANALYTICS_SITE_TAG,
  } = process.env;
  if (
    !CLOUDFLARE_API_TOKEN ||
    !CLOUDFLARE_ACCOUNT_ID ||
    !CF_WEB_ANALYTICS_SITE_TAG
  ) {
    return {
      missing:
        "CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID and CF_WEB_ANALYTICS_SITE_TAG are not all set",
    };
  }

  const groups = (alias, from, to, dimension, limit) => `
    ${alias}: rumPageloadEventsAdaptiveGroups(
      limit: ${limit}
      ${dimension ? "orderBy: [count_DESC]" : ""}
      filter: { AND: [{ datetime_geq: ${from}, datetime_lt: ${to} }, { siteTag: $siteTag }, { bot: 0 }] }
    ) {
      count
      sum { visits }
      ${dimension ? `dimensions { key: ${dimension} }` : ""}
    }`;

  const query = `
    query WeeklyReport($accountTag: string!, $siteTag: string!, $prevStart: Time!, $start: Time!, $end: Time!) {
      viewer {
        accounts(filter: { accountTag: $accountTag }) {
          ${groups("total", "$start", "$end", null, 1)}
          ${groups("prevTotal", "$prevStart", "$start", null, 1)}
          ${groups("pages", "$start", "$end", "requestPath", 50)}
          ${groups("prevPages", "$prevStart", "$start", "requestPath", 200)}
          ${groups("referrers", "$start", "$end", "refererHost", 20)}
          ${groups("countries", "$start", "$end", "countryName", TOP)}
          ${groups("devices", "$start", "$end", "deviceType", 5)}
        }
      }
    }`;

  const data = await cloudflareGraphql(query, {
    accountTag: CLOUDFLARE_ACCOUNT_ID,
    siteTag: CF_WEB_ANALYTICS_SITE_TAG,
    prevStart: prevStart.toISOString(),
    start: start.toISOString(),
    end: end.toISOString(),
  });
  const account = data.viewer?.accounts?.[0];
  if (!account)
    throw new Error(
      `Cloudflare GraphQL: no account ${CLOUDFLARE_ACCOUNT_ID} for this token`,
    );

  const totals = (g) => ({
    views: g?.[0]?.count ?? 0,
    visits: g?.[0]?.sum?.visits ?? 0,
  });
  const rows = (g) =>
    (g ?? []).map((r) => ({
      key: r.dimensions.key,
      views: r.count,
      visits: r.sum.visits,
    }));

  const prevViews = new Map(
    rows(account.prevPages).map((r) => [normalizePath(r.key), r.views]),
  );
  // Merge "/about" and "/about/" (Cloudflare 307s one to the other) into one row.
  const pages = new Map();
  for (const row of rows(account.pages)) {
    const path = normalizePath(row.key);
    const page = pages.get(path) ?? {
      path,
      views: 0,
      visits: 0,
      prevViews: prevViews.get(path) ?? 0,
    };
    page.views += row.views;
    page.visits += row.visits;
    pages.set(path, page);
  }

  return {
    current: totals(account.total),
    previous: totals(account.prevTotal),
    pages: [...pages.values()].sort((a, b) => b.views - a.views).slice(0, TOP),
    // Navigation inside the site arrives with the site as its referrer.
    referrers: rows(account.referrers)
      .filter((r) => r.key !== SITE_HOST && !r.key?.endsWith(".workers.dev"))
      .map((r) => ({ ...r, key: r.key || "Direct or unknown" }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, TOP),
    countries: rows(account.countries),
    devices: rows(account.devices),
  };
}

// Unique IPs per day from the zone's edge logs. Every request counts: bots,
// crawlers and feed readers included, and one IP can be many people behind
// one network. Cloudflare counts uniques per day, so a week's figure would
// count a reader once per day they came back. The report shows the daily
// average instead of a sum that would look like people.
async function readEdgeUniques() {
  const { CLOUDFLARE_ZONE_ID } = process.env;
  if (!CLOUDFLARE_ZONE_ID) return null;
  const date = (d) => d.toISOString().slice(0, 10);
  try {
    const data = await cloudflareGraphql(
      `query EdgeUniques($zoneTag: string!, $from: Date!, $to: Date!) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            days: httpRequests1dGroups(limit: 14, filter: { date_geq: $from, date_lt: $to }) {
              dimensions { date }
              uniq { uniques }
            }
          }
        }
      }`,
      { zoneTag: CLOUDFLARE_ZONE_ID, from: date(prevStart), to: date(end) },
    );
    const zone = data.viewer?.zones?.[0];
    if (!zone) throw new Error(`no zone ${CLOUDFLARE_ZONE_ID} for this token`);
    const average = (from, to) => {
      const days = zone.days.filter(
        (d) => d.dimensions.date >= date(from) && d.dimensions.date < date(to),
      );
      const total = days.reduce((sum, d) => sum + d.uniq.uniques, 0);
      return days.length ? Math.round(total / days.length) : 0;
    };
    return {
      current: average(start, end),
      previous: average(prevStart, start),
    };
  } catch (error) {
    // A secondary number: report the failure in the email rather than
    // failing the run and losing the rest of the report.
    return { error: error.message };
  }
}

// --- Performance ------------------------------------------------------------

// Google's Core Web Vitals thresholds, rated at the 75th percentile:
// at or under `good` is good, over `poor` is poor.
// https://web.dev/articles/vitals
const VITALS = [
  {
    key: "lcp",
    label: "LCP",
    what: "main content shown",
    field: "largestContentfulPaintP75",
    good: 2.5,
    poor: 4,
    unit: "s",
  },
  {
    key: "inp",
    label: "INP",
    what: "response to a tap or click",
    field: "interactionToNextPaintP75",
    good: 0.2,
    poor: 0.5,
    unit: "s",
  },
  {
    key: "cls",
    label: "CLS",
    what: "layout shift, Chromium only",
    field: "cumulativeLayoutShiftP75",
    good: 0.1,
    poor: 0.25,
    unit: "",
  },
];
// A page needs this many samples before the report calls it slow.
const MIN_PAGE_SAMPLES = 5;

// Real-reader timings from the same beacon. Cloudflare stores times in
// microseconds; CLS is a unitless score. A secondary section: a failed query
// shows in the email rather than stopping the send.
async function readPerformance() {
  const {
    CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ACCOUNT_ID,
    CF_WEB_ANALYTICS_SITE_TAG,
  } = process.env;
  if (
    !CLOUDFLARE_API_TOKEN ||
    !CLOUDFLARE_ACCOUNT_ID ||
    !CF_WEB_ANALYTICS_SITE_TAG
  )
    return null;

  const filter = (from, to) =>
    `filter: { AND: [{ datetime_geq: ${from}, datetime_lt: ${to} }, { siteTag: $siteTag }, { bot: 0 }] }`;
  const vitals = VITALS.map((v) => v.field).join(" ");
  try {
    const data = await cloudflareGraphql(
      `query WeeklyPerformance($accountTag: string!, $siteTag: string!, $prevStart: Time!, $start: Time!, $end: Time!) {
        viewer {
          accounts(filter: { accountTag: $accountTag }) {
            vitals: rumWebVitalsEventsAdaptiveGroups(limit: 1, ${filter("$start", "$end")}) {
              count
              quantiles { ${vitals} }
            }
            prevVitals: rumWebVitalsEventsAdaptiveGroups(limit: 1, ${filter("$prevStart", "$start")}) {
              quantiles { ${vitals} }
            }
            pageVitals: rumWebVitalsEventsAdaptiveGroups(limit: 50, orderBy: [count_DESC], ${filter("$start", "$end")}) {
              count
              quantiles { largestContentfulPaintP75 }
              dimensions { key: requestPath }
            }
            load: rumPerformanceEventsAdaptiveGroups(limit: 1, ${filter("$start", "$end")}) {
              quantiles { pageLoadTimeP75 }
            }
            prevLoad: rumPerformanceEventsAdaptiveGroups(limit: 1, ${filter("$prevStart", "$start")}) {
              quantiles { pageLoadTimeP75 }
            }
          }
        }
      }`,
      {
        accountTag: CLOUDFLARE_ACCOUNT_ID,
        siteTag: CF_WEB_ANALYTICS_SITE_TAG,
        prevStart: prevStart.toISOString(),
        start: start.toISOString(),
        end: end.toISOString(),
      },
    );
    const account = data.viewer?.accounts?.[0];
    if (!account)
      throw new Error(`no account ${CLOUDFLARE_ACCOUNT_ID} for this token`);

    const value = (v, quantiles) => {
      const raw = quantiles?.[v.field];
      if (raw == null) return null;
      return v.unit === "s" ? raw / 1e6 : raw;
    };
    const current = account.vitals?.[0]?.quantiles;
    const previous = account.prevVitals?.[0]?.quantiles;
    const seconds = (g) => {
      const raw = g?.[0]?.quantiles?.pageLoadTimeP75;
      return raw == null ? null : raw / 1e6;
    };
    const lcp = VITALS[0];

    return {
      samples: account.vitals?.[0]?.count ?? 0,
      vitals: VITALS.map((v) => ({
        ...v,
        current: value(v, current),
        previous: value(v, previous),
      })),
      load: {
        current: seconds(account.load),
        previous: seconds(account.prevLoad),
      },
      slowPages: (account.pageVitals ?? [])
        .filter((r) => r.count >= MIN_PAGE_SAMPLES)
        .map((r) => ({
          path: normalizePath(r.dimensions.key),
          samples: r.count,
          lcp: value(lcp, r.quantiles),
        }))
        .filter((r) => r.lcp != null && r.lcp > lcp.poor)
        .sort((a, b) => b.lcp - a.lcp)
        .slice(0, 5),
    };
  } catch (error) {
    return { error: error.message };
  }
}

function rating(v, x) {
  if (x == null) return "";
  if (x <= v.good) return "good";
  if (x <= v.poor) return "needs improvement";
  return "poor";
}

function formatMetric(unit, x) {
  if (x == null) return "no data";
  if (unit !== "s") return x.toFixed(2);
  return x < 1 ? `${Math.round(x * 1000)} ms` : `${x.toFixed(2)} s`;
}

// Lower is better for every timing, so a rise is labelled "slower".
function timingChange(unit, current, previous) {
  if (current == null || previous == null || previous === 0) return "";
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return "no change";
  const word =
    unit === "s"
      ? pct > 0
        ? "slower"
        : "faster"
      : pct > 0
        ? "worse"
        : "better";
  return `${Math.abs(pct)}% ${word}`;
}

async function cloudflareGraphql(query, variables) {
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body || body.errors?.length) {
    const detail =
      body?.errors?.map((e) => e.message).join("; ") ||
      `HTTP ${response.status}`;
    throw new Error(`Cloudflare GraphQL: ${detail}`);
  }
  return body.data ?? {};
}

function normalizePath(path) {
  return (path || "/").replace(/\/+$/, "") || "/";
}

// --- Activity ---------------------------------------------------------------

function git(...gitArgs) {
  return execFileSync("git", gitArgs, { encoding: "utf8" }).trim();
}

function readActivity(posts) {
  const range = [
    `--since=${start.toISOString()}`,
    `--until=${end.toISOString()}`,
  ];
  const commits = git("log", "--first-parent", ...range, "--format=%h%x09%s")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, ...subject] = line.split("\t");
      return { hash, subject: subject.join("\t") };
    });

  const inWindow = (date) => {
    const t = Date.parse(`${date}T00:00:00Z`);
    return t >= start.getTime() && t < end.getTime();
  };
  const published = [...posts.values()].filter(
    (p) => p.date && inWindow(p.date),
  );

  const touched = new Set(
    git(
      "log",
      "--first-parent",
      ...range,
      "--format=",
      "--name-only",
      "--",
      BLOG_DIR,
    )
      .split("\n")
      .map((f) => f.match(/([^/]+)\.mdx?$/)?.[1])
      .filter(Boolean),
  );
  const updated = [...touched]
    .filter((id) => posts.has(id) && !published.some((p) => p.id === id))
    .map((id) => posts.get(id));

  return { commits, published, updated };
}

// --- Rendering --------------------------------------------------------------

const number = (n) => n.toLocaleString("en-US");
const day = (d) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
const windowLabel = `${day(start)} to ${day(new Date(end.getTime() - DAY))}`;

function change(current, previous) {
  if (previous === 0) return current === 0 ? "no change" : "new";
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct === 0 ? "no change" : `${pct > 0 ? "+" : ""}${pct}%`;
}

function subjectLine(traffic, activity) {
  const parts = [];
  if (traffic && !traffic.missing)
    parts.push(`${number(traffic.current.views)} views`);
  if (activity.published.length) {
    parts.push(
      `${activity.published.length} post${activity.published.length > 1 ? "s" : ""} published`,
    );
  }
  return `[kylejs.me] weekly: ${parts.join(", ") || "quiet week"}`;
}

function edgeLine(edge) {
  if (edge.error) return `Not available: ${edge.error}`;
  return `${number(edge.current)} a day (${change(edge.current, edge.previous)}), from edge logs, includes bots`;
}

function renderText(traffic, edge, perf, activity, posts) {
  const lines = [`kylejs.me, ${windowLabel} (UTC)`, ""];
  const table = (rows) => {
    const width = Math.min(48, Math.max(...rows.map((r) => r[0].length)));
    return rows.map(([label, ...cells]) => {
      const cut =
        label.length > width ? `${label.slice(0, width - 3)}...` : label;
      return `  ${cut.padEnd(width)}  ${cells.join("  ")}`;
    });
  };

  lines.push("TRAFFIC");
  if (traffic.missing) {
    lines.push(`  Not available: ${traffic.missing}.`);
  } else if (traffic.error) {
    lines.push(`  Not available: ${traffic.error}`);
  } else {
    const { current, previous } = traffic;
    lines.push(
      `  Page views  ${number(current.views)} (${change(current.views, previous.views)})`,
    );
    lines.push(
      `  Visits      ${number(current.visits)} (${change(current.visits, previous.visits)})`,
    );
    if (edge) lines.push(`  Unique IPs  ${edgeLine(edge)}`);
    if (traffic.pages.length) {
      lines.push("", "TOP PAGES (views, change on last week)");
      lines.push(
        ...table(
          traffic.pages.map((p) => [
            pageLabel(p.path, posts),
            number(p.views).padStart(6),
            change(p.views, p.prevViews),
          ]),
        ),
      );
    }
    lines.push("", "REFERRERS (visits)");
    const refs = traffic.referrers.map((r) => [
      r.key,
      number(r.visits).padStart(6),
    ]);
    lines.push(...(refs.length ? table(refs) : ["  None"]));
    if (traffic.countries.length) {
      lines.push(
        "",
        "COUNTRIES (views)",
        ...table(
          traffic.countries.map((c) => [
            c.key || "Unknown",
            number(c.views).padStart(6),
          ]),
        ),
      );
    }
    if (traffic.devices.length) {
      lines.push(
        "",
        "DEVICES (views)",
        ...table(
          traffic.devices.map((d) => [
            d.key || "Unknown",
            number(d.views).padStart(6),
          ]),
        ),
      );
    }
  }

  if (perf) {
    lines.push("", "PERFORMANCE (75th percentile reader)");
    if (perf.error) {
      lines.push(`  Not available: ${perf.error}`);
    } else {
      const rows = perf.vitals.map((v) => [
        `${v.label} (${v.what})`,
        formatMetric(v.unit, v.current).padStart(8),
        rating(v, v.current).padEnd(17),
        timingChange(v.unit, v.current, v.previous),
      ]);
      rows.push([
        "Page load",
        formatMetric("s", perf.load.current).padStart(8),
        "".padEnd(17),
        timingChange("s", perf.load.current, perf.load.previous),
      ]);
      lines.push(...table(rows).map((line) => line.trimEnd()));
      lines.push(`  From ${number(perf.samples)} page views.`);
      if (perf.slowPages.length) {
        lines.push("", "SLOW PAGES (LCP over 4 s)");
        lines.push(
          ...table(
            perf.slowPages.map((p) => [
              pageLabel(p.path, posts),
              formatMetric("s", p.lcp).padStart(8),
              `${number(p.samples)} views`,
            ]),
          ),
        );
      }
    }
  }

  lines.push("", "ACTIVITY");
  if (activity.published.length) {
    lines.push("  Published:");
    for (const p of activity.published)
      lines.push(`    ${p.title}  ${SITE_URL}/posts/${p.id}`);
  }
  if (activity.updated.length) {
    lines.push("  Edited:");
    for (const p of activity.updated) lines.push(`    ${p.title}`);
  }
  lines.push(
    `  ${activity.commits.length} commit${activity.commits.length === 1 ? "" : "s"} to main`,
  );
  for (const c of activity.commits) lines.push(`    ${c.hash}  ${c.subject}`);
  lines.push(
    "",
    `Dashboard: https://dash.cloudflare.com/?to=/:account/web-analytics`,
  );
  return lines.join("\n") + "\n";
}

// Paths, referrers and commit subjects come from visitors and committers.
// Everything that reaches the HTML goes through here.
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

function renderHtml(traffic, edge, perf, activity, posts) {
  const cell =
    "padding:4px 12px 4px 0;border-bottom:1px solid #e5e5e5;text-align:left;";
  const num = `${cell}text-align:right;font-variant-numeric:tabular-nums;`;
  const heading = (text) =>
    `<h2 style="font-size:15px;margin:24px 0 8px;">${escape(text)}</h2>`;
  const table = (head, rows) =>
    `<table style="border-collapse:collapse;font-size:14px;">` +
    `<tr>${head.map((h, i) => `<th style="${i ? num : cell}color:#666;font-weight:normal;">${escape(h)}</th>`).join("")}</tr>` +
    rows
      .map(
        (r) =>
          `<tr>${r.map((v, i) => `<td style="${i ? num : cell}">${v}</td>`).join("")}</tr>`,
      )
      .join("") +
    `</table>`;

  const parts = [
    `<p style="color:#666;margin:0;">${escape(windowLabel)} (UTC)</p>`,
  ];

  parts.push(heading("Traffic"));
  if (traffic.missing || traffic.error) {
    parts.push(
      `<p>Not available: ${escape(traffic.missing ?? traffic.error)}</p>`,
    );
  } else {
    const { current, previous } = traffic;
    parts.push(
      table(
        ["", "This week", "Change"],
        [
          [
            "Page views",
            number(current.views),
            escape(change(current.views, previous.views)),
          ],
          [
            "Visits",
            number(current.visits),
            escape(change(current.visits, previous.visits)),
          ],
          ...(edge && !edge.error
            ? [
                [
                  "Unique IPs a day",
                  number(edge.current),
                  escape(change(edge.current, edge.previous)),
                ],
              ]
            : []),
        ],
      ),
    );
    if (edge) {
      parts.push(
        `<p style="color:#666;font-size:13px;margin:4px 0 0;">${
          edge.error
            ? `Unique IPs not available: ${escape(edge.error)}`
            : "Unique IPs: daily average from Cloudflare's edge logs. Includes bots, and one IP can be several readers."
        }</p>`,
      );
    }
    if (traffic.pages.length) {
      parts.push(heading("Top pages"));
      parts.push(
        table(
          ["Page", "Views", "Change"],
          traffic.pages.map((p) => [
            `<a href="${escape(SITE_URL + p.path)}">${escape(pageLabel(p.path, posts))}</a>`,
            number(p.views),
            escape(change(p.views, p.prevViews)),
          ]),
        ),
      );
    }
    const refs = traffic.referrers.map((r) => [
      escape(r.key),
      number(r.visits),
    ]);
    parts.push(
      heading("Referrers"),
      refs.length ? table(["Source", "Visits"], refs) : "<p>None</p>",
    );
    if (traffic.countries.length) {
      parts.push(
        heading("Countries"),
        table(
          ["Country", "Views"],
          traffic.countries.map((c) => [
            escape(c.key || "Unknown"),
            number(c.views),
          ]),
        ),
      );
    }
    if (traffic.devices.length) {
      parts.push(
        heading("Devices"),
        table(
          ["Device", "Views"],
          traffic.devices.map((d) => [
            escape(d.key || "Unknown"),
            number(d.views),
          ]),
        ),
      );
    }
  }

  if (perf) {
    parts.push(heading("Performance"));
    if (perf.error) {
      parts.push(`<p>Not available: ${escape(perf.error)}</p>`);
    } else {
      const colour = {
        good: "#0a7d32",
        "needs improvement": "#a15c00",
        poor: "#b42318",
      };
      const rated = (v, x) => {
        const r = rating(v, x);
        return r ? `<span style="color:${colour[r]};">${escape(r)}</span>` : "";
      };
      parts.push(
        table(
          ["75th percentile", "This week", "Rating", "Change"],
          [
            ...perf.vitals.map((v) => [
              `${escape(v.label)} <span style="color:#666;">${escape(v.what)}</span>`,
              escape(formatMetric(v.unit, v.current)),
              rated(v, v.current),
              escape(timingChange(v.unit, v.current, v.previous)),
            ]),
            [
              "Page load",
              escape(formatMetric("s", perf.load.current)),
              "",
              escape(timingChange("s", perf.load.current, perf.load.previous)),
            ],
          ],
        ),
        `<p style="color:#666;font-size:13px;margin:4px 0 0;">From ${number(perf.samples)} page views. Ratings use Google's Core Web Vitals thresholds.</p>`,
      );
      if (perf.slowPages.length) {
        parts.push(
          heading("Slow pages (LCP over 4 s)"),
          table(
            ["Page", "LCP", "Views"],
            perf.slowPages.map((p) => [
              `<a href="${escape(SITE_URL + p.path)}">${escape(pageLabel(p.path, posts))}</a>`,
              escape(formatMetric("s", p.lcp)),
              number(p.samples),
            ]),
          ),
        );
      }
    }
  }

  parts.push(heading("Activity"));
  const list = (items) =>
    `<ul style="margin:4px 0;padding-left:20px;">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  if (activity.published.length) {
    parts.push(
      `<p style="margin:8px 0 0;">Published</p>`,
      list(
        activity.published.map(
          (p) =>
            `<a href="${escape(`${SITE_URL}/posts/${p.id}`)}">${escape(p.title)}</a>`,
        ),
      ),
    );
  }
  if (activity.updated.length) {
    parts.push(
      `<p style="margin:8px 0 0;">Edited</p>`,
      list(activity.updated.map((p) => escape(p.title))),
    );
  }
  parts.push(
    `<p style="margin:8px 0 0;">${activity.commits.length} commit${activity.commits.length === 1 ? "" : "s"} to main</p>`,
  );
  if (activity.commits.length) {
    parts.push(
      list(
        activity.commits.map(
          (c) => `<code>${escape(c.hash)}</code> ${escape(c.subject)}`,
        ),
      ),
    );
  }
  parts.push(
    `<p style="margin-top:24px;"><a href="https://dash.cloudflare.com/?to=/:account/web-analytics">Web Analytics dashboard</a></p>`,
  );

  return `<!doctype html><html><body style="font-family:-apple-system,system-ui,sans-serif;color:#111;max-width:640px;">${parts.join("\n")}</body></html>`;
}

// --- Main -------------------------------------------------------------------

const posts = await readPosts();
const activity = readActivity(posts);
let traffic;
try {
  traffic = await readTraffic();
} catch (error) {
  // A dry run shows the failure in the report. A real run fails the workflow,
  // which GitHub emails about, rather than mailing a report with a hole in it.
  if (!dryRun) fail(error.message);
  traffic = { error: error.message };
}

const edge = await readEdgeUniques();
const perf = traffic.missing ? null : await readPerformance();

const subject = subjectLine(traffic, activity);
const text = renderText(traffic, edge, perf, activity, posts);
const html = renderHtml(traffic, edge, perf, activity, posts);

if (dryRun) {
  console.log(printHtml ? html : `Subject: ${subject}\n\n${text}`);
  process.exit(0);
}

if (traffic.missing) fail(`Not sending: ${traffic.missing}.`);
const { SMTP_USERNAME, SMTP_PASSWORD } = process.env;
if (!SMTP_USERNAME || !SMTP_PASSWORD)
  fail("SMTP_USERNAME and SMTP_PASSWORD must be set to send.");

const { createTransport } = await import("nodemailer");
const transport = createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  // 465 is implicit TLS. Any other port must upgrade with STARTTLS or fail,
  // so the password never crosses the network in clear.
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  requireTLS: true,
  auth: { user: SMTP_USERNAME, pass: SMTP_PASSWORD },
});
const info = await transport.sendMail({
  from: SMTP_USERNAME,
  to: process.env.REPORT_TO || SMTP_USERNAME,
  subject,
  text,
  html,
});
console.log(`Sent "${subject}" (${info.messageId})`);
