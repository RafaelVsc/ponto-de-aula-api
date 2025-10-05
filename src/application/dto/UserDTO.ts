// src/application/dto/UserDTO.ts
import { UserRole } from '@/domain/entities/User';

export interface UserOutputDTO {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  registeredAt?: Date;
  updatedAt?: Date;
}
