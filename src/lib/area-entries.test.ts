import { describe, expect, it } from "vitest";
import { groupByArea } from "./area-entries";

const entry = (id: string, areas: string[]) => ({
  id,
  data: { areas: areas.map((a) => ({ id: a })) },
});

describe("groupByArea", () => {
  it("groups entries under each area they list, keeping input order", () => {
    const a = entry("a", ["coding"]);
    const b = entry("b", ["coding", "coffee"]);
    const byArea = groupByArea("Post", ["coding", "coffee", "fishing"], [a, b]);

    expect(byArea.get("coding")).toEqual([a, b]);
    expect(byArea.get("coffee")).toEqual([b]);
    expect(byArea.get("fishing")).toEqual([]);
  });

  it("throws on an area that does not exist", () => {
    expect(() =>
      groupByArea("Project", ["coding"], [entry("stray", ["knitting"])]),
    ).toThrow('Project "stray" lists area "knitting", which does not exist');
  });
});
