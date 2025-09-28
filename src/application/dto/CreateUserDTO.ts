import { UserRole } from '@/domain/entities/User';

export interface CreateUserInputDTO {
  name: string;
  username?: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateUserOutputDTO {
  id: string;
  email: string;
  username?: string;
  role: UserRole;
}
