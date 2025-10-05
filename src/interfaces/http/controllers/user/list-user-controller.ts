import { ListUsersUseCase } from '@/application/usecases/users/list-user-use-case';
import { NextFunction, Request, Response } from 'express';

export class ListUserController {
  constructor(private listUserUseCase: ListUsersUseCase) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const currentUser = res.locals.auth;
      const users = await this.listUserUseCase.execute(currentUser);
      return res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  }
}
