import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { DeleteUserUseCase } from '@/application/usecases/users/delete-user-use-case';
import { ListUsersUseCase } from '@/application/usecases/users/list-user-use-case';
import { UpdateUserUseCase } from '@/application/usecases/users/update-user-use-case';
import { InMemoryUserRepository } from '@/infrastructure/database/in-memory-user-repository';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';
import { CreateUserController } from '@/interfaces/http/controllers/user/create-user-controller';
import { DeleteUserController } from '@/interfaces/http/controllers/user/delete-user-controller';
import { ListUserController } from '@/interfaces/http/controllers/user/list-user-controller';
import { UpdateUserController } from '@/interfaces/http/controllers/user/update-user-controller';
import userRoutes from '@/interfaces/routes/users-routes';
import { Router } from 'express';

export function buildUserModule(userRepository: InMemoryUserRepository): Router {
  const passwordHasher = new BcryptHasher();

  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const listUserController = new ListUserController(listUsersUseCase)

  const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
  const createUserController = new CreateUserController(createUserUseCase);

  const updateUserUseCase = new UpdateUserUseCase(userRepository, passwordHasher);
  const updateUserController = new UpdateUserController(updateUserUseCase);

  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  const router = Router();
  userRoutes(router, listUserController, createUserController, updateUserController, deleteUserController);
  return router;
}
