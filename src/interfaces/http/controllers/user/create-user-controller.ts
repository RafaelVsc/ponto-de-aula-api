import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { NextFunction, Request, Response } from 'express';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Como o middleware de validação Zod já validou os dados,
      // não precisamos mais fazer validações manuais
      const result = await this.createUserUseCase.execute(req.body);

      return res.status(201).json({
        data: result,
      });
    } catch (error) {
      return next(error)
      // if (error instanceof Error) {
      //   return res.status(400).json({
      //     status: 'error',
      //     message: error.message,
      //   });
      // }

      // return res.status(500).json({
      //   status: 'error',
      //   message: 'Erro interno do servidor',
      // });
    }
  }
}
