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

export const collections = { blog, projects };
