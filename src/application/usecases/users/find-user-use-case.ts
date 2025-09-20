import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';

export class FindUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }
}
