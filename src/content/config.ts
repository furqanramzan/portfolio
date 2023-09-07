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

const aboutme = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const specialization = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  social,
  aboutme,
  specialization,
};
