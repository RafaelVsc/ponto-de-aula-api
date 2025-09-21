import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string(),
  authorId: z.uuid(),
  videoUrl: z.url().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type CreatePostValidatorInput = z.infer<typeof createPostSchema>;
