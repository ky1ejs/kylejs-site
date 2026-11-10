interface Tagged {
  id: string;
  data: { areas: { id: string }[] };
}

/**
 * Groups posts or projects by the areas they list in frontmatter, keeping
 * input order within each area.
 *
 * Astro's `reference()` only logs a missing entry, so the build would pass
 * with a typo. This throws instead, so an unknown area fails the build.
 */
export function groupByArea<E extends Tagged>(
  kind: string,
  areaIds: string[],
  entries: E[],
): Map<string, E[]> {
  const byArea = new Map<string, E[]>(areaIds.map((id) => [id, []]));
  for (const entry of entries) {
    for (const { id } of entry.data.areas) {
      const list = byArea.get(id);
      if (!list) {
        throw new Error(
          `${kind} "${entry.id}" lists area "${id}", which does not exist. Areas: ${areaIds.join(", ")}`,
        );
      }
      list.push(entry);
    }
  }
  return byArea;
}
