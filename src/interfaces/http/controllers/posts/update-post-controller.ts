import { UpdatePostUseCase } from '@/application/usecases/posts/update-post-use-case';
import { NextFunction, Request, Response } from 'express';

export class UpdatePostController {
  constructor(private updatePostUseCase: UpdatePostUseCase) { }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // O parâmetro 'id' já foi validado pelo middleware de rota (uuidParamSchema)
      // Aqui assumimos que 'postId' é sempre uma string válida
      const postId = req.params.id as string;
      const userId = res.locals.auth.id;
      const updated = await this.updatePostUseCase.execute(postId, req.body, userId);
      return res.status(200).json({ data: updated });
    } catch (error) {
      return next(error)
    }
  }
}
