// validators/post/search-posts-validator.ts
import { z } from 'zod';

export const searchQuerySchema = z.object({
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  authorId: z.uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
