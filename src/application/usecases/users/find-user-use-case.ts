import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class FindUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(userId: string, currentUser: { id: string, role: UserRole }): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (currentUser.role === UserRole.ADMIN) {
      return user;
    }
    // SECRETARY pode buscar apenas STUDENT/TEACHER
    if (
      currentUser.role === UserRole.SECRETARY &&
      [UserRole.STUDENT, UserRole.TEACHER].includes(user.role)
    ) {
      return user;
    }
    // Usuário comum só pode buscar a si mesmo
    if (currentUser.id === userId) return user;

    throw new AppError('Forbidden', 403);
  }
}
