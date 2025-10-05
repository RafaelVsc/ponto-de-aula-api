import { UpdateUserInputDTO, UpdateUserOutputDTO } from '@/application/dto/UpdateUserDTO';
import { userToOutputDTO } from '@/application/mappers/user-mapper';
import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    data: UpdateUserInputDTO,
    currentUser: { id: string; role: UserRole },
  ): Promise<UpdateUserOutputDTO> {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new AppError('Forbidden', 403);
    }

    const current = await this.userRepository.findById(id);
    if (!current) {
      throw new AppError('User not found', 404);
    }

    const { name, email } = data;

    if (email && email !== current.email) {
      const existingByEmail = await this.userRepository.findByEmail(email);
      if (existingByEmail && existingByEmail.id !== current.id) {
        throw new AppError('Email already registered', 409);
      }
    }

    const updatePayload: Partial<User> = {};
    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email;

    const updated = await this.userRepository.update(id, updatePayload);
    if (!updated) {
      throw new AppError('Failed to update user', 500);
    }

    return userToOutputDTO(updated);
  }
}
