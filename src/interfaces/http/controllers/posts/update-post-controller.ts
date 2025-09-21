import { Request, Response } from 'express';
import { UpdatePostUseCase } from '@/application/usecases/posts/update-post-use-case';

export class UpdatePostController {
  constructor(private updatePostUseCase: UpdatePostUseCase) {}

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const postId = req.params.id;
      if (!postId) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
      }

      const updated = await this.updatePostUseCase.execute(postId, req.body);
      return res.status(200).json({ data: updated });
    } catch (error) {
      const status = (error as any)?.status || 400;
      if (error instanceof Error) {
        return res.status(status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
