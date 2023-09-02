import { defineCollection, z } from 'astro:content';

const social = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    link: z.string().url(),
    icon: z.string(),
  }),
});

export const collections = {
  social,
};
