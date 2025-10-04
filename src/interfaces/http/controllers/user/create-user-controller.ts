import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { NextFunction, Request, Response } from 'express';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Como o middleware de validação Zod já validou os dados,
      // não precisamos mais fazer validações manuais
      const currentUserRole = res.locals.auth.role;
      const result = await this.createUserUseCase.execute(req.body, currentUserRole);

      return res.status(201).json({
        data: result,
      });
    } catch (error) {
      return next(error)
    }
  }
}
