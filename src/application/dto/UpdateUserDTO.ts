import { UserRole } from '@/domain/entities/User';

export interface UpdateUserInputDTO {
  name?: string;
  email?: string;
}

export interface UpdateUserOutputDTO {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
}
