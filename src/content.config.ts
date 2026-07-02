import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection, reference } from 'astro:content';

const page = defineCollection({
  loader: glob({ base: './src/content/page', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    ogdescription: z.string(),
  }),
});

const social = defineCollection({
  loader: glob({ base: './src/content/social', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    link: z.url(),
    icon: z.string(),
    order: z.number(),
  }),
});

const aboutme = defineCollection({
  loader: glob({ base: './src/content/aboutme', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const specialization = defineCollection({
  loader: glob({
    base: './src/content/specialization',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const skill = defineCollection({
  loader: glob({ base: './src/content/skill', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const skillcategory = defineCollection({
  loader: glob({
    base: './src/content/skillcategory',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    skills: z.array(reference('skill')),
    order: z.number(),
  }),
});

const project = defineCollection({
  loader: glob({ base: './src/content/project', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      link: z.url().optional(),
      image: image(),
      skills: z.array(reference('skill')),
      order: z.number(),
    }),
});

const repository = defineCollection({
  loader: glob({ base: './src/content/repository', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    link: z.url(),
    skills: z.array(reference('skill')),
    order: z.number(),
  }),
});

const education = defineCollection({
  loader: glob({ base: './src/content/education', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    degree: z.string(),
    institute: z.string(),
    year: z.string(),
    order: z.number(),
  }),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    designation: z.string(),
    company: z.string(),
    year: z.string(),
    skills: z.array(reference('skill')),
    order: z.number(),
  }),
});

const article = defineCollection({
  loader: glob({ base: './src/content/article', pattern: '**/*.{md,mdx}' }),
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
  page,
};
