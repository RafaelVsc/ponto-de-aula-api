import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new AppError('User not found', 404);
    }
    await this.userRepository.delete(id);
  }
}
