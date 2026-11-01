interface TaggedPost {
  id: string;
  data: { date: Date; areas: { id: string }[] };
}

/**
 * Groups posts by the areas they list in frontmatter, newest first.
 *
 * Astro's `reference()` only logs a missing entry, so the build would pass
 * with a typo. This throws instead, so an unknown area fails the build.
 */
export function postsByArea<P extends TaggedPost>(areaIds: string[], posts: P[]): Map<string, P[]> {
  const byArea = new Map<string, P[]>(areaIds.map((id) => [id, []]));
  for (const post of posts) {
    for (const { id } of post.data.areas) {
      const list = byArea.get(id);
      if (!list) {
        throw new Error(
          `Post "${post.id}" lists area "${id}", which does not exist. Areas: ${areaIds.join(", ")}`,
        );
      }
      list.push(post);
    }
  }
  for (const list of byArea.values()) {
    list.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }
  return byArea;
}
