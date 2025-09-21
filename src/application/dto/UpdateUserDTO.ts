import { UserRole } from '@/domain/entities/User';

export interface UpdateUserInputDTO {
  name?: string;
  email?: string;
  password?: string;
  // Removido username e role pois não são editáveis
}

export interface UpdateUserOutputDTO {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
}
