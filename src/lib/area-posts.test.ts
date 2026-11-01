import { describe, expect, it } from "vitest";
import { postsByArea } from "./area-posts";

const post = (id: string, date: string, areas: string[]) => ({
  id,
  data: { date: new Date(date), areas: areas.map((a) => ({ id: a })) },
});

describe("postsByArea", () => {
  it("groups posts under each area they list, newest first", () => {
    const old = post("old", "2024-01-01", ["coding"]);
    const recent = post("recent", "2026-01-01", ["coding", "coffee"]);
    const byArea = postsByArea(["coding", "coffee", "fishing"], [old, recent]);

    expect(byArea.get("coding")).toEqual([recent, old]);
    expect(byArea.get("coffee")).toEqual([recent]);
    expect(byArea.get("fishing")).toEqual([]);
  });

  it("throws on an area that does not exist", () => {
    expect(() => postsByArea(["coding"], [post("stray", "2026-01-01", ["knitting"])])).toThrow(
      'Post "stray" lists area "knitting", which does not exist',
    );
  });
});
