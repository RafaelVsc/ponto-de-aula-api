import { UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, role: UserRole): Promise<void> {
    if (role !== UserRole.ADMIN) {
      throw new AppError('Only ADMIN can delete users', 403);
    }
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new AppError('User not found', 404);
    }
    await this.userRepository.delete(id);
  }
}
