import { User } from '@/domain/entities/User';
import { UserOutputDTO } from '@/application/dto/UserDTO';

export const userToOutputDTO = (user: User): UserOutputDTO => ({
  id: user.id!,
  name: user.name,
  email: user.email,
  username: user.username,
  role: user.role,
  registeredAt: user.registeredAt,
  updatedAt: user.updatedAt,
});

export const usersToOutputDTO = (users: User[]): UserOutputDTO[] => users.map(userToOutputDTO);
