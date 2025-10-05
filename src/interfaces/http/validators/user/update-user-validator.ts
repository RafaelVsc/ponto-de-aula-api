import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  // Não incluímos role nem username, conforme requisitos de negócio
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});