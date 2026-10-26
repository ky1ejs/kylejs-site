import { defineCollection } from "astro:content";
import { z } from "astro/zod";
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

// Sections of the about page, rendered by src/pages/about.astro
const about = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./content/about" }),
});

export const collections = { blog, about };
