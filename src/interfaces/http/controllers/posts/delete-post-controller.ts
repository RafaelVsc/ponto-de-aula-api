import { DeletePostUseCase } from '@/application/usecases/posts/delete-post-use-case';
import { Request, Response, NextFunction } from 'express';

export class DeletePostController {
  constructor(private deletePostUseCase: DeletePostUseCase) { }

  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // O parâmetro 'id' já foi validado pelo middleware de rota (uuidParamSchema)
      // Aqui assumimos que 'postId' é sempre uma string válida
      const postId = req.params.id as string;
      await this.deletePostUseCase.execute(postId);
      return res.status(204).send();
    } catch (error) {
      return next(error)
    }
  }
}
