import { ChangePasswordUseCase } from '@/application/usecases/users/change-password-use-case';
import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { DeleteUserUseCase } from '@/application/usecases/users/delete-user-use-case';
import { FindUserUseCase } from '@/application/usecases/users/find-user-use-case';
import { ListUsersUseCase } from '@/application/usecases/users/list-user-use-case';
import { UpdateUserUseCase } from '@/application/usecases/users/update-user-use-case';
import { InMemoryUserRepository } from '@/infrastructure/database/in-memory-user-repository';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';
import { ChangePasswordController } from '@/interfaces/http/controllers/user/change-password-controller';
import { CreateUserController } from '@/interfaces/http/controllers/user/create-user-controller';
import { DeleteUserController } from '@/interfaces/http/controllers/user/delete-user-controller';
import { FindUserController } from '@/interfaces/http/controllers/user/find-user-controller';
import { ListUserController } from '@/interfaces/http/controllers/user/list-user-controller';
import { UpdateUserController } from '@/interfaces/http/controllers/user/update-user-controller';
import userRoutes from '@/interfaces/routes/users-routes';
import { Router } from 'express';

export function buildUserModule(userRepository: InMemoryUserRepository): Router {
  const passwordHasher = new BcryptHasher();

  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const listUserController = new ListUserController(listUsersUseCase);

  const findUserUseCase = new FindUserUseCase(userRepository);
  const findUserController = new FindUserController(findUserUseCase);

  const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
  const createUserController = new CreateUserController(createUserUseCase);

  const updateUserUseCase = new UpdateUserUseCase(userRepository, passwordHasher);
  const updateUserController = new UpdateUserController(updateUserUseCase);

  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  const changePasswordUseCase = new ChangePasswordUseCase(userRepository, passwordHasher);
  const changePasswordController = new ChangePasswordController(changePasswordUseCase);

  const router = Router();
  userRoutes(
    router,
    listUserController,
    findUserController,
    createUserController,
    updateUserController,
    deleteUserController,
    changePasswordController,
  );
  return router;
}
