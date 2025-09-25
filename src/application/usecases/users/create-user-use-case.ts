import { CreateUserInputDTO, CreateUserOutputDTO } from '@/application/dto/CreateUserDTO';
import { PasswordHasher } from '@/application/services/password-hasher';
import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const { name, email, password, role, username } = input;

    const emailExist = await this.userRepository.findByEmail(email);
    if (emailExist) throw new AppError('Email already registered', 400);

    if (username) {
      const usernameExists = await this.userRepository.findByUsername(username);
      if (usernameExists) throw new AppError('Username already registered', 400);
    }

    const roleIsValid = Object.values(UserRole).includes(role as UserRole);
    if (!roleIsValid) throw new AppError('Invalid role', 400);

    const passwordHash = await this.passwordHasher.hash(password);
    const user: User = {
      name,
      email,
      username,
      password: passwordHash,
      role,
    };

    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.id!,
      email: createdUser.email,
      username: createdUser.username,
      role: createdUser.role,
    };
  }
}
