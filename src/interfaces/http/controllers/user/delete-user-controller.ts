import { DeleteUserUseCase } from '@/application/usecases/users/delete-user-use-case';
import { NextFunction, Request, Response } from 'express';

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}
  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const role = res.locals.auth.role;
      const userId = req.params.id as string;
      await this.deleteUserUseCase.execute(userId, role);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
