import type { ProjectStatus } from "../design/components";

/** Sections when /projects is grouped by status, in this order. */
export const statusGroups: {
  id: ProjectStatus;
  title: string;
  blurb: string;
}[] = [
  { id: "active", title: "Active", blurb: "Commits in the last six months." },
  {
    id: "experiment",
    title: "Experiments",
    blurb: "Things I'm trying out, still with recent commits.",
  },
  {
    id: "parked",
    title: "Parked",
    blurb:
      "No commits in six months. Not finished, just not this month's rabbit hole.",
  },
  {
    id: "archived",
    title: "Archived",
    blurb: "Archived on GitHub: superseded, or done with.",
  },
];
