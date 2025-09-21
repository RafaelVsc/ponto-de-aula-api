import { z } from 'zod';

export const updatePostSchema = z
  .object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    videoUrl: z.url().optional(),
    imageUrl: z.url().optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Você deve fornecer pelo menos um campo para atualizar',
  });
