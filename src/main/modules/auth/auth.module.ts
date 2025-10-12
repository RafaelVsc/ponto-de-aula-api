import { TokenService } from '@/application/services/token-service';
import { LoginUseCase } from '@/application/usecases/auth/login-use-case';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';
import { LoginController } from '@/interfaces/http/controllers/auth/login-controller';
import authRoutes from '@/interfaces/routes/auth-routes';
import { Router } from 'express';

export function buildAuthModule(
  userRepository: UserRepository,
  tokenService: TokenService,
): Router {
  // Criar instâncias das dependências
  const passwordHasher = new BcryptHasher();

  // Criar caso de uso
  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

  // Criar controller
  const loginController = new LoginController(loginUseCase);

  // Configurar rotas
  const router = Router();
  authRoutes(router, loginController);

  return router;
}
