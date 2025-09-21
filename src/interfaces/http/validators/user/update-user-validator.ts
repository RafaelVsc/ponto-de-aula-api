import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
  // Não incluímos role nem username, conforme requisitos de negócio
}).refine(data => Object.keys(data).length > 0, {
  message: "Forneça pelo menos um campo para atualização (nome, email ou senha)"
});