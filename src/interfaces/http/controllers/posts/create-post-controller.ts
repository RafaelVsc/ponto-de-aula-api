import { Request, Response } from 'express';
import { CreatePostUseCase } from '@/application/usecases/posts/create-post-use-case';

export class CreatePostController {
  constructor(private createPostUseCase: CreatePostUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { title, content, authorId, videoUrl, imageUrl, tags } = req.body;
      if (!title || !content || !authorId) {
        return res.status(400).json({ error: 'title, content e authorId são obrigatórios' });
      }

      const result = await this.createPostUseCase.execute({
        title,
        content,
        authorId,
        videoUrl,
        imageUrl,
        tags: tags || [],
      });

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
