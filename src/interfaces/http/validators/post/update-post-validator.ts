import { z } from 'zod';

export const updatePostSchema = z
  .object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    videoUrl: z.union([z.url(), z.literal("")]).optional(),
    imageUrl: z.union([z.url(), z.literal("")]).optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'You must provide at least one field to update',
  });
