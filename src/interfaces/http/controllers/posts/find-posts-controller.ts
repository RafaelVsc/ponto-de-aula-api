import { GetPostByIdUseCase } from '@/application/usecases/posts/get-posts-by-id-use-case';
import { ListPostAuthorsUseCase } from '@/application/usecases/posts/list-post-authors-use-case';
import { ListPostsUseCase } from '@/application/usecases/posts/list-posts-use-case';
import { SearchPostsUseCase } from '@/application/usecases/posts/search-posts-use-case';
import { UserRole } from '@/domain/entities/User';
import { NextFunction, Request, Response } from 'express';

export class ListAllPostsController {
  constructor(
    private listPostUseCase: ListPostsUseCase,
    private getPostByIdUseCase: GetPostByIdUseCase,
    private searchPostsUseCase: SearchPostsUseCase,
    private listPostAuthorsUseCase: ListPostAuthorsUseCase,
  ) {}

  async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // O parâmetro 'id' já foi validado pelo middleware de rota (uuidParamSchema)
      // Aqui assumimos que 'postId' é sempre uma string válida
      const postId = req.params.id as string;
      const foundPost = await this.getPostByIdUseCase.execute(postId);
      return res.status(200).json({ data: foundPost });
    } catch (error) {
      next(error);
    }
  }

  async listAuthors(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const authors = await this.listPostAuthorsUseCase.execute();
      return res.status(200).json({ data: authors });
    } catch (error) {
      next(error);
    }
  }

  async listAll(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = await this.listPostUseCase.execute();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { search, tag, authorId, authorName, title, page, limit, sortBy, sortOrder } = (
        req as any
      ).validatedQuery;

      const result = await this.searchPostsUseCase.execute({
        search,
        tag,
        authorId,
        authorName,
        title,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async myPosts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { search, tag, page, limit, sortBy, sortOrder } = (req as any).validatedQuery;
      const currentUser = res.locals.auth as { id: string; role: UserRole };
      const result = await this.searchPostsUseCase.execute({
        search,
        tag,
        authorId: currentUser.id,
        page,
        limit,
        sortBy,
        sortOrder,
      });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
