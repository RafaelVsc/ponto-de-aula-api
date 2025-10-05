import { ChangePasswordInputDTO, ChangePasswordOutputDTO } from '@/application/dto/ChangePasswordDTO';
import { PasswordHasher } from '@/application/services/password-hasher';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(userId: string, data: ChangePasswordInputDTO): Promise<ChangePasswordOutputDTO> {
    const { currentPassword, newPassword } = data;

    // Validar que as senhas são diferentes
    if (currentPassword === newPassword) {
      throw new AppError('New password must be different from current password', 400);
    }

    // Buscar o usuário
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Validar senha atual
    const isValid = await this.passwordHasher.compare(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Current password is invalid', 401);
    }

    // Atualizar senha
    const hashedPassword = await this.passwordHasher.hash(newPassword);
    const updated = await this.userRepository.update(userId, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    if (!updated) {
      throw new AppError('Failed to update password', 500);
    }

    return {
      success: true,
      message: 'Password updated successfully'
    };
  }
}