import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      status: z.enum(['complete', 'in-progress']),
      tags: z.array(z.string()).default([]),
      github: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: ({ image }) =>
    z.object({
      company: z.string(),
      logo: image().optional(),
      title: z.string(),
      start: z.coerce.date(),
      end: z.coerce.date().optional(), // omit = Present
      tools: z.array(z.string()).default([]),
      domain: z.string(),
    }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/certifications' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.coerce.date(),
      url: z.url().optional(),
      status: z.enum(['earned', 'in-progress']).default('earned'),
      badge: image().optional(), // small badge image shown beside the cert
    }),
});

export const collections = { projects, experience, certifications };
