import { defineCollection, z } from 'astro:content';

const social = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().url(),
    icon: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  social,
};
