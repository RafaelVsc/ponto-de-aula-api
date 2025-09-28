import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class FindUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if(!user) {
      throw new AppError('User not found', 404);
    }
    return user
  }
}
