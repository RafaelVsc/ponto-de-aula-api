import { GetPostByIdUseCase } from '@/application/usecases/posts/get-posts-by-id-use-case';
import { ListPostsUseCase } from '@/application/usecases/posts/list-posts-use-case';
import { SearchPostsUseCase } from '@/application/usecases/posts/search-posts-use-case';
import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { searchQuerySchema } from '@/interfaces/http/validators/post/search-post-validator';


export class ListAllPostsController {
  constructor(
    private listPostUseCase: ListPostsUseCase,
    private getPostByIdUseCase: GetPostByIdUseCase,
    private searchPostsUseCase: SearchPostsUseCase,
  ) { }

  async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const postId = req.params.id;
      if (!postId) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
      }

      const foundPost = await this.getPostByIdUseCase.execute(postId);
      return res.status(200).json({ data: foundPost });
    } catch (error) {
      next(error)
    }
  }

  async listAll(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const posts = await this.listPostUseCase.execute();
      return res.status(200).json({ data: posts });
    } catch (error) {
      next(error)
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { search, tag, authorId, page, limit, sortBy, sortOrder } = req.query as any;

      // if (!search && !tag && !authorId) {
      //   const posts = await this.listPostUseCase.execute();
      //   return res.status(200).json({ data: posts });
      // }

      const posts = await this.searchPostsUseCase.execute({
        search,
        tag,
        authorId,
        page,
        limit,
        sortBy,
        sortOrder
      })

      return res.status(200).json({ data: posts })

    } catch (error) {
      next(error)
    }
  }
}
