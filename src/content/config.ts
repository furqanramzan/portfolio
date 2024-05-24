import { defineCollection, reference, z } from 'astro:content';

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

const skill = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const skillcategory = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    skills: z.array(reference('skill')),
    order: z.number(),
  }),
});

const project = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      link: z.string().url().optional(),
      image: image(),
      skills: z.array(reference('skill')),
      order: z.number(),
    }),
});

const repository = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().url(),
    skills: z.array(reference('skill')),
    order: z.number(),
  }),
});

const education = defineCollection({
  type: 'content',
  schema: z.object({
    degree: z.string(),
    institute: z.string(),
    year: z.string(),
    order: z.number(),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    designation: z.string(),
    company: z.string(),
    year: z.string(),
    skills: z.array(reference('skill')),
    order: z.number(),
  }),
});

const article = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      ogdescription: z.string().optional(),
      date: z.date(),
      image: image().optional(),
      skills: z.array(reference('skill')),
      order: z.number(),
    }),
});

export const collections = {
  social,
  aboutme,
  specialization,
  skillcategory,
  skill,
  project,
  repository,
  education,
  experience,
  article,
};
