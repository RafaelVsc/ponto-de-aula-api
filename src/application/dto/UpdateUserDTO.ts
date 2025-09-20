import { UserRole } from '@/domain/entities/User';

export interface UpdateUserInputDTO {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UpdateUserOutputDTO {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
}
