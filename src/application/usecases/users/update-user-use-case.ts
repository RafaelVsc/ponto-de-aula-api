import { UpdateUserInputDTO, UpdateUserOutputDTO } from '@/application/dto/UpdateUserDTO';
import { PasswordHasher } from '@/application/services/password-hasher';
import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(id: string, data: UpdateUserInputDTO): Promise<UpdateUserOutputDTO> {
    const current = await this.userRepository.findById(id);
    if (!current) {
      throw new AppError('User not found', 404);
    }

    const { name, email, username, role, password } = data;

    if (email && email !== current.email) {
      const existingByEmail = await this.userRepository.findByEmail(email);
      if (existingByEmail && existingByEmail.id !== current.id) {
        throw new AppError('Email already registered', 409);
      }
    }

    if (username && username !== current.username) {
      const existingByUsername = await this.userRepository.findByUsername(username);
      if (existingByUsername && existingByUsername.id !== current.id) {
        throw new AppError('Username already registered', 409);
      }
    }

    const updatePayload: Partial<User> = {};
    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email;
    if (username !== undefined) updatePayload.username = username;
    if (role !== undefined) updatePayload.role = role;

    if (password) {
      const passwordHash = await this.passwordHasher.hash(password);
      updatePayload.password = passwordHash;
    }

    const updated = await this.userRepository.update(id, updatePayload);
    if (!updated) {
      throw new AppError('User not found', 404);
    }

    return {
      id: updated.id!,
      name: updated.name,
      email: updated.email,
      username: updated.username ?? undefined,
      role: updated.role,
    };
  }
}
