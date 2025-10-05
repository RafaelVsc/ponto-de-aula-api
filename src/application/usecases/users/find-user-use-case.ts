import { UserOutputDTO } from '@/application/dto/UserDTO';
import { userToOutputDTO } from '@/application/mappers/user-mapper';
import { UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class FindUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    userId: string,
    currentUser: { id: string; role: UserRole },
  ): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (currentUser.role === UserRole.ADMIN) {
      return userToOutputDTO(user);
    }
    // SECRETARY pode buscar apenas STUDENT/TEACHER
    if (
      currentUser.role === UserRole.SECRETARY &&
      [UserRole.STUDENT, UserRole.TEACHER].includes(user.role)
    ) {
      return userToOutputDTO(user);
    }
    // Usuário comum só pode buscar a si mesmo - metodo findMe
    if (currentUser.id === userId) return userToOutputDTO(user);

    throw new AppError('Forbidden', 403);
  }
}
