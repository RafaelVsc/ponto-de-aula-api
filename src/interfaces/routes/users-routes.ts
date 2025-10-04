import { UserRole } from '@/domain/entities/User';
import { CreateUserController } from '@/interfaces/http/controllers/user/create-user-controller';
import { UpdateUserController } from '@/interfaces/http/controllers/user/update-user-controller';
import { authorize } from '@/interfaces/http/middlewares/authorize';
import { validateParams } from '@/interfaces/http/middlewares/params-validator';
import { validateBody } from '@/interfaces/http/middlewares/validation-middleware';
import { uuidParamSchema } from '@/interfaces/http/validators/common/route-params-validator';
import { createUserSchema } from '@/interfaces/http/validators/user/create-user-validator';
import { updateUserSchema } from '@/interfaces/http/validators/user/update-user-validator';
import { Router } from 'express';
import { DeleteUserController } from '../http/controllers/user/delete-user-controller';
import { ListUserController } from '../http/controllers/user/list-user-controller';

export default (
  router: Router,
  listUserController: ListUserController,
  createUserController: CreateUserController,
  updateUserController: UpdateUserController,
  deleteUserController: DeleteUserController
): void => {
  router.post('/',
    authorize(UserRole.ADMIN, UserRole.SECRETARY),
    validateBody(createUserSchema),
    (req, res, next) => createUserController.create(req, res, next));

  router.get('/',
    authorize(UserRole.ADMIN, UserRole.SECRETARY),
    (req, res, next) => listUserController.list(req, res, next));

  router.patch('/:id', validateParams(uuidParamSchema), validateBody(updateUserSchema), (req, res, next) => updateUserController.update(req, res, next));
  router.delete('/:id',
    authorize(UserRole.ADMIN),
    validateParams(uuidParamSchema),
    (req, res, next) => deleteUserController.delete(req, res, next)
  );
};
