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

export default (
  router: Router,
  createUserController: CreateUserController,
  updateUserController: UpdateUserController
): void => {
  router.post('/',
    authorize(UserRole.ADMIN, UserRole.SECRETARY),
    validateBody(createUserSchema), 
    (req, res, next) => createUserController.create(req, res, next));
    
  router.patch('/:id', validateParams(uuidParamSchema), validateBody(updateUserSchema), (req, res, next) => updateUserController.update(req, res, next));
};
