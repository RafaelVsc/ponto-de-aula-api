import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required and must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters")
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});