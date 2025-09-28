import { Request, Response, NextFunction } from 'express';
import { CreatePostUseCase } from '@/application/usecases/posts/create-post-use-case';

export class CreatePostController {
  constructor(private createPostUseCase: CreatePostUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Como o middleware de validação já validou os dados,
      // podemos apenas enviar para o caso de uso
      const result = await this.createPostUseCase.execute(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Post criado com sucesso',
        data: result,
      });
    } catch (error) {
      return next(error)
    }
  }
}
