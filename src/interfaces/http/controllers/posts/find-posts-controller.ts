import { GetPostByIdUseCase } from '@/application/usecases/posts/get-posts-by-id-use-case';
import { ListPostsUseCase } from '@/application/usecases/posts/list-posts-use-case';
import { SearchPostsUseCase } from '@/application/usecases/posts/search-posts-use-case';
import { UserRole } from '@/domain/entities/User';
import { NextFunction, Request, Response } from 'express';


export class ListAllPostsController {
  constructor(
    private listPostUseCase: ListPostsUseCase,
    private getPostByIdUseCase: GetPostByIdUseCase,
    private searchPostsUseCase: SearchPostsUseCase,
  ) { }

  async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // O parâmetro 'id' já foi validado pelo middleware de rota (uuidParamSchema)
      // Aqui assumimos que 'postId' é sempre uma string válida
      const postId = req.params.id as string;
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

  async myPosts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { search, tag, page, limit, sortBy, sortOrder } = req.query as any;
      const currentUser = res.locals.auth as { id: string; role: UserRole }
      const posts = await this.searchPostsUseCase.execute({
        search,
        tag,
        authorId: currentUser.id,
        page,
        limit,
        sortBy,
        sortOrder
      });
      return res.status(200).json({ data: posts })
    } catch (error) {
      next(error)
    }
  }
}
