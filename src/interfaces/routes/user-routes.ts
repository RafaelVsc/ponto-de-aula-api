import { Router } from 'express';
import { CreateUserController } from '@/interfaces/http/controllers/user/create-user-controller';
import { UpdateUserController } from '@/interfaces/http/controllers/user/update-user-controller';
import { createUserSchema } from '@/interfaces/http/validators/user/create-user-validator';
import { updateUserSchema } from '@/interfaces/http/validators/user/update-user-validator';
import { validate } from '@/interfaces/http/middlewares/validation-middleware';
import { validateParams } from '../http/middlewares/params-validator';
import { uuidParamSchema } from '../http/validators/common/route-params-validator';

export default (
  router: Router, 
  createUserController: CreateUserController,
  updateUserController: UpdateUserController
): void => {
  router.post('/', validate(createUserSchema), (req, res) => createUserController.create(req, res));
  router.patch('/:id', validateParams(uuidParamSchema) ,validate(updateUserSchema), (req, res) => updateUserController.update(req, res));
};
