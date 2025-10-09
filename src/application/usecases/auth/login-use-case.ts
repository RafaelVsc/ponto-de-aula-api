import { LoginOutPutDTO, LoginUserInputDTO } from '@/application/dto/LoginDTO';
import { PasswordHasher } from '@/application/services/password-hasher';
import { TokenService } from '@/application/services/token-service';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginUserInputDTO): Promise<LoginOutPutDTO> {
    const { email, username, password } = input;
    if (!email && !username) {
      throw new AppError('Email or Username is required', 400);
    }

    const user = email
      ? await this.userRepository.findByEmail(email)
      : await this.userRepository.findByUsername(username!);

    if (!user?.id) throw new AppError('Invalid credentials', 401);

    const isValid = await this.passwordHasher.compare(password, user.password);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    const token = this.tokenService.sign({ id: user.id, role: user.role });

    return { token };
  }
}
