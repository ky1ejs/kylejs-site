import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { markNames, type MarkName } from "./design/marks";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    shareImage: z.string().optional(),
    reviewers: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: z.enum(["espresso", "apps", "tools", "keyboards", "workshop"]),
    /** GitHub repo as "owner/name". Omit for projects with no public repo. */
    repo: z.string().optional(),
    /** Live site, if there is one. */
    url: z.url().optional(),
    /** Year last worked on. Omitted where it isn't known rather than guessed. */
    year: z.number().int().optional(),
    status: z.enum(["active", "shipped", "experiment", "archived"]).default("shipped"),
    /** Lower sorts first within a group. */
    order: z.number().default(50),
  }),
});

/**
 * Areas are the things Kyle does. They drive the home page, in `order`.
 *
 * Layout is a content decision, not a code one. Promoting an area or a good
 * photo means editing frontmatter, never a component:
 *   - `display`      band (full width, with items) or compact (small card)
 *   - `media.layout` side (photo beside the items from 720px) or stack (above)
 * An image with no `src` renders as a labelled placeholder, so the page is
 * complete before any photography exists.
 */
const areas = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/areas" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      mark: z.enum(markNames as [MarkName, ...MarkName[]]),
      /** Short label for the area rail. Falls back to `title`. */
      railLabel: z.string().optional(),
      /** Lower sorts first. Kyle's own ranking. */
      order: z.number(),
      display: z.enum(["band", "compact"]).default("compact"),
      /** Small right-aligned label, e.g. "Linea Micra". */
      meta: z.string().optional(),
      /** The one line on why this is Kyle. */
      why: z.string(),
      /** How the interest led to projects. `accent` marks steps that became code or a site. */
      chain: z.array(z.object({ label: z.string(), accent: z.boolean().default(false) })).default([]),
      media: z
        .object({
          layout: z.enum(["side", "stack"]).default("stack"),
          images: z
            .array(
              z.object({
                /** Path relative to this file, under src/assets/areas/. Omit for a placeholder. */
                src: image().optional(),
                alt: z.string(),
                /** Placeholder text until `src` is set. */
                label: z.string().optional(),
              }),
            )
            .default([]),
        })
        .default({ layout: "stack", images: [] }),
      items: z
        .array(
          z.object({
            /** Repo, Post, Site, Print… shown as a pill. */
            kind: z.string(),
            title: z.string(),
            desc: z.string().optional(),
            href: z.string().optional(),
            /** A post: accent pill with the writing mark. */
            writing: z.boolean().default(false),
          }),
        )
        .default([]),
    }),
});

// Sections of the about page, rendered by src/pages/about.astro
const about = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./content/about" }),
});

export const collections = { blog, about, projects, areas };
