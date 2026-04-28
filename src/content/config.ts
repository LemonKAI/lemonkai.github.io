import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(["zh", "en"]).default("en"),
    kind: z.enum(["series", "note", "incident"]).default("note"),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    translationKey: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
