import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { InMemoryUserRepository } from '@/infrastructure/database/in-memory-user-repository';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';
import { CreateUserController } from '@/interfaces/http/controllers/user/create-user-controller';
import userRoutes from '@/interfaces/routes/user-routes';
import { Router } from 'express';

export function buildUserModule(): Router {
  const userRepository = new InMemoryUserRepository();
  const passwordHasher = new BcryptHasher();
  const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
  const userController = new CreateUserController(createUserUseCase);

  const router = Router();
  userRoutes(router, userController);
  return router;
}
