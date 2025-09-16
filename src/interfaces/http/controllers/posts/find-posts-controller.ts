import { GetPostByIdUseCase } from '../../../../application/usecases/posts/get-posts-by-id-use-case';
import { ListPostsUseCase } from '../../../../application/usecases/posts/list-posts-use-case';
import { Request, Response } from 'express';
import { SearchPostsUseCase } from '../../../../application/usecases/posts/search-posts-use-case';

export class ListAllPostsController {
  constructor(private listPostUseCase: ListPostsUseCase,
    private getPostByIdUseCase: GetPostByIdUseCase,
    private searchPostsUseCase: SearchPostsUseCase
  ) { }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const postId = req.params.id;
      if (!postId) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
      }

      const findedPost = await this.getPostByIdUseCase.execute(postId);
      return res.status(200).json(findedPost);


    } catch (error) {
      const status = (error as any)?.status || 400;
      if (error instanceof Error) {
        return res.status(status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });

    }
  }

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

  async search(req: Request, res: Response): Promise<Response> {
    try {
      const { search, tag, authorId, page, limit, sortBy, sortOrder } = req.query;

      if (search || tag || authorId || page || limit || sortBy || sortOrder) {
        const posts = await this.searchPostsUseCase.execute({
          search: typeof search === 'string' ? search : undefined,
          tag: typeof tag === 'string' ? tag : undefined,
          authorId: typeof authorId === 'string' ? authorId : undefined,
          page: typeof page === 'string' ? Number(page) : undefined,
          limit: typeof limit === 'string' ? Number(limit) : undefined,
          sortBy: (typeof sortBy === 'string' ? (sortBy as any) : undefined),
          sortOrder: (typeof sortOrder === 'string' ? (sortOrder as any) : undefined),
        });
        return res.status(200).json(posts);
      }

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
