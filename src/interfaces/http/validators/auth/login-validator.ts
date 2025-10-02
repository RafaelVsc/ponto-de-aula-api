import {z} from 'zod';

export const loginSchema = z.object({
    email: z.email().optional(),
    username: z.string().min(8).optional(),
    password: z.string().min(8)
}).refine(data => data.email || data.username, {
    message: 'Email or Username is required',
    path: ['email', 'username']
})
export type LoginInput = z.infer<typeof loginSchema>;