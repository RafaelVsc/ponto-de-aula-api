import { ListPostsUseCase } from "../../../../application/usecases/posts/list-posts-use-case"; 
import { Request, Response } from "express";

export class ListAllPostsController {
    constructor(private listPostUseCase: 
        ListPostsUseCase
    ) {}

  async listAll(_req: Request, res: Response): Promise<Response> {
    try {
      const posts = await this.listPostUseCase.execute();
      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
