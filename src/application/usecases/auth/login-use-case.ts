import { LoginOutPutDTO, LoginUserInputDTO } from "@/application/dto/LoginDTO";
import { PasswordHasher } from "@/application/services/password-hasher";
import { UserRepository } from "@/domain/repositories/users/user-repository";
import { JwtService } from "@/infrastructure/security/jwt-service";
import { AppError } from "@/shared/errors/app-error";


export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly jwtService: JwtService
    ) { }

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

        const token = this.jwtService.sign({ id: user.id, role: user.role });
        
        return { token };

    }
}