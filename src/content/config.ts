import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const servicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

const facilitiesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    category: z.string(),
    icon: z.string(),
    order: z.number(),
    description: z.string().optional(),
    items: z.array(z.string()),
  }),
});

export const collections = {
  pages: pagesCollection,
  services: servicesCollection,
  facilities: facilitiesCollection,
};
