import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
    url: z.string().url().optional(),
    /** Year last worked on. Omitted where it isn't known rather than guessed. */
    year: z.number().int().optional(),
    status: z.enum(["active", "shipped", "experiment", "archived"]).default("shipped"),
    /** Featured projects surface on the home page. */
    featured: z.boolean().default(false),
    /** Lower sorts first within a group. */
    order: z.number().default(50),
  }),
});

/**
 * Areas are the things Kyle actually does. They drive the home page.
 *
 * Layout is deliberately a content decision, not a code one — promoting an area
 * or a great photo means editing frontmatter here, never touching a component:
 *   - `display`      band (full width, with items) or compact (small card)
 *   - `media.layout` how this area's images are arranged; "hero" is the escape
 *                    hatch for an image good enough to carry the whole section
 * An image with no `src` renders as a marked placeholder, so the page is
 * complete and shippable before any photography exists.
 */
const areas = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/areas" }),
  schema: z.object({
    title: z.string(),
    mark: z.enum([
      "code", "printer", "chip", "keyboard",
      "coffee", "camera", "fish", "mountain", "weight",
    ]),
    /** Short label for the sticky rail. Falls back to `title` when omitted. */
    railLabel: z.string().optional(),
    /** Lower sorts first. Kyle's own ranking. */
    order: z.number(),
    display: z.enum(["band", "compact"]).default("compact"),
    /** Small right-aligned label, e.g. "29 designs". */
    meta: z.string().optional(),
    /** The one-line "why this is me". */
    why: z.string(),
    /** Escalation chain — plain steps, `code: true` for the ones that became software. */
    chain: z
      .array(z.object({ label: z.string(), code: z.boolean().default(false) }))
      .default([]),
    media: z
      .object({
        layout: z.enum(["grid", "wide", "side", "hero"]).default("grid"),
        images: z
          .array(
            z.object({
              /** Path under /public. Omit to render a placeholder slot. */
              src: z.string().optional(),
              alt: z.string(),
              label: z.string().optional(),
            })
          )
          .default([]),
      })
      .default({ layout: "grid", images: [] }),
    items: z
      .array(
        z.object({
          /** Repo, Post, Site, Print… shown as a small pill. */
          kind: z.string(),
          title: z.string(),
          desc: z.string().optional(),
          href: z.string().optional(),
          /** Marks it with the pen — writing runs through every area. */
          writing: z.boolean().default(false),
        })
      )
      .default([]),
  }),
});

export const collections = { blog, projects, areas };
