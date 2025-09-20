import { Router } from 'express';
import { CreateUserController } from '../http/controllers/user/create-user-controller';

export default (router: Router, createUserController: CreateUserController): void => {
  router.post('/', (req, res) => createUserController.create(req, res));
};
