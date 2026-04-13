import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    shareImage: z.string().optional(),
    reviewers: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
