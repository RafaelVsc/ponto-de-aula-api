import { CreatePostUseCase } from "../../../../application/usecases/posts/create-post-use-case";
import { Request, Response } from "express";

export class PostController {
  constructor(private createPostUseCase: CreatePostUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const post = await this.createPostUseCase.execute(req.body);
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}