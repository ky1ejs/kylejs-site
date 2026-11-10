import { describe, expect, it } from "vitest";
import { dateChunks, rankPosts } from "./most-read";

describe("rankPosts", () => {
  const ids = ["why-blog", "why-i-fly-fish", "remote-agents", "ic-to-em-and-back"];

  it("orders posts by views and keeps the top few", () => {
    const rows = [
      { path: "/posts/why-blog", views: 10 },
      { path: "/posts/why-i-fly-fish", views: 40 },
      { path: "/posts/remote-agents", views: 25 },
      { path: "/posts/ic-to-em-and-back", views: 5 },
    ];
    expect(rankPosts(rows, ids, 3)).toEqual(["why-i-fly-fish", "remote-agents", "why-blog"]);
  });

  it("adds up views of the same post under different paths and chunks", () => {
    const rows = [
      { path: "/posts/why-blog", views: 10 },
      { path: "/posts/why-blog/", views: 10 },
      { path: "/posts/why-blog.html", views: 10 },
      { path: "/posts/why-i-fly-fish", views: 25 },
    ];
    expect(rankPosts(rows, ids, 2)).toEqual(["why-blog", "why-i-fly-fish"]);
  });

  it("ignores pages that are not posts, and posts that no longer exist", () => {
    const rows = [
      { path: "/", views: 500 },
      { path: "/posts", views: 300 },
      { path: "/about", views: 200 },
      { path: "/posts/deleted-post", views: 100 },
      { path: "/posts/why-blog/extra", views: 100 },
      { path: "/posts/why-blog", views: 1 },
    ];
    expect(rankPosts(rows, ids, 3)).toEqual(["why-blog"]);
  });

  it("breaks ties by ID so rebuilds give the same order", () => {
    const rows = [
      { path: "/posts/why-i-fly-fish", views: 7 },
      { path: "/posts/remote-agents", views: 7 },
    ];
    expect(rankPosts(rows, ids, 3)).toEqual(["remote-agents", "why-i-fly-fish"]);
  });

  it("returns nothing without data", () => {
    expect(rankPosts([], ids, 3)).toEqual([]);
  });
});

describe("dateChunks", () => {
  const end = new Date("2026-11-10T00:00:00Z");

  it("covers the whole range in week-long chunks without overlap", () => {
    const chunks = dateChunks(end, 20);
    expect(chunks.map((c) => [c.start.toISOString(), c.end.toISOString()])).toEqual([
      ["2026-11-03T00:00:01.000Z", "2026-11-10T00:00:00.000Z"],
      ["2026-10-27T00:00:01.000Z", "2026-11-03T00:00:00.000Z"],
      ["2026-10-21T00:00:01.000Z", "2026-10-27T00:00:00.000Z"],
    ]);
  });
});
