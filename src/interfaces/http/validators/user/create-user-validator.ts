import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  username: z.string().trim().min(4).nonempty().optional(),
  email: z.email(),
  password: z.string().min(8).nonempty(),
  role: z.enum(['STUDENT', 'TEACHER', 'SECRETARY', 'ADMIN']),
});