import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string(),
  videoUrl: z.url().optional(),
  imageUrl: z.url().optional(),
  tags: z.array(z.string()).optional().default([]),
});