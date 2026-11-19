import { describe, expect, it } from "vitest";
import { compareStats, metaFor, statusFor, type RepoStats } from "./github";

const stats = (s: Partial<RepoStats>): RepoStats => ({
  stars: 0,
  forks: 0,
  archived: false,
  language: null,
  lastCommit: null,
  commits90d: 0,
  ...s,
});
const now = new Date("2026-11-10T00:00:00Z");

describe("statusFor", () => {
  const recent = stats({ lastCommit: "2026-09-01T00:00:00Z" });
  const stale = stats({ lastCommit: "2026-03-01T00:00:00Z" });

  it("shows an archived repo, or one the frontmatter archives, as archived", () => {
    expect(
      statusFor(
        undefined,
        stats({ archived: true, lastCommit: "2026-11-01T00:00:00Z" }),
        now,
      ),
    ).toBe("archived");
    expect(statusFor("archived", recent, now)).toBe("archived");
  });

  it("parks anything without a commit in six months", () => {
    expect(statusFor(undefined, stale, now)).toBe("parked");
    expect(statusFor("experiment", stale, now)).toBe("parked");
    expect(statusFor(undefined, stats({}), now)).toBe("parked");
  });

  it("shows recent work as active, or as an experiment when marked", () => {
    expect(statusFor(undefined, recent, now)).toBe("active");
    expect(statusFor("experiment", recent, now)).toBe("experiment");
  });

  it("falls back to the frontmatter without GitHub data", () => {
    expect(statusFor(undefined, undefined, now)).toBe("active");
    expect(statusFor("experiment", undefined, now)).toBe("experiment");
  });
});

describe("compareStats", () => {
  it("puts more recent commits first, then the newest commit", () => {
    const busy = stats({ commits90d: 20 });
    const recent = stats({ lastCommit: "2026-10-01T00:00:00Z" });
    const old = stats({ lastCommit: "2020-01-01T00:00:00Z" });
    expect([old, undefined, recent, busy].sort(compareStats)).toEqual([
      busy,
      recent,
      old,
      undefined,
    ]);
  });
});

describe("metaFor", () => {
  it("joins language, stars from five and the month of the last commit", () => {
    expect(
      metaFor(
        stats({
          language: "Swift",
          stars: 61,
          lastCommit: "2020-10-28T12:00:00Z",
        }),
      ),
    ).toBe("Swift · 61★ · Oct 2020");
    expect(metaFor(stats({ language: "Go", stars: 4 }))).toBe("Go");
    expect(metaFor(stats({}))).toBeUndefined();
  });
});
