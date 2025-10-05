import { UserOutputDTO } from '@/application/dto/UserDTO';
import { usersToOutputDTO } from '@/application/mappers/user-mapper';
import { UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(currentUser: { id: string; role: UserRole }): Promise<UserOutputDTO[]> {
    if (currentUser.role === UserRole.ADMIN) {
      const users = await this.userRepository.findAll();
      return usersToOutputDTO(users);
    }

    if (currentUser.role === UserRole.SECRETARY) {
      const users = await this.userRepository.findAll({
        roles: [UserRole.STUDENT, UserRole.TEACHER],
      });
      return usersToOutputDTO(users);
    }
    throw new AppError('Forbidden', 403);
  }
}
