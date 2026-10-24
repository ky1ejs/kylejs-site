export type ProjectGroupId =
  | "espresso"
  | "apps"
  | "tools"
  | "keyboards"
  | "workshop";

export interface ProjectGroup {
  id: ProjectGroupId;
  title: string;
  /** One or two lines setting up why this group of projects exists. */
  blurb: string;
}

/** Order here is the order they appear on /projects. */
export const projectGroups: ProjectGroup[] = [
  {
    id: "espresso",
    title: "Espresso",
    blurb:
      "A coffee habit that got out of hand. It started with picking a machine, and ended with me writing firmware for it.",
  },
  {
    id: "apps",
    title: "Apps",
    blurb:
      "Things I've shipped, and things I started and haven't finished. Mostly iOS, increasingly not.",
  },
  {
    id: "tools",
    title: "Developer tools",
    blurb:
      "Small things built to make my own work better. A few of them turned out to make other people's better too.",
  },
  {
    id: "keyboards",
    title: "Keyboards",
    blurb: "Split, ergonomic, and endlessly re-mapped.",
  },
  {
    id: "workshop",
    title: "Home lab & workshop",
    blurb: "The house, the printer, and the microcontrollers in between.",
  },
];
