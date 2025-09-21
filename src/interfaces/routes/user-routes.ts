import { Router } from 'express';
import { CreateUserController } from '@/interfaces/http/controllers/user/create-user-controller';
import { createUserSchema } from '@/interfaces/http/validators/user/create-user-validator';
import { validate } from '@/interfaces/http/middlewares/validation-middleware';

export default (router: Router, createUserController: CreateUserController): void => {
  router.post('/', validate(createUserSchema), (req, res) => createUserController.create(req, res));
};
