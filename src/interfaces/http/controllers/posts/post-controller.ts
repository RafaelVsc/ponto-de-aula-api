import { CreatePostUseCase } from "../../../../application/usecases/posts/create-post-use-case";
import { ListPostsUseCase } from "../../../../application/usecases/posts/list-posts-use-case";
import { GetPostByIdUseCase } from "../../../../application/usecases/posts/get-posts-by-id-use-case";
import { SearchPostsUseCase } from "../../../../application/usecases/posts/search-posts-use-case";
import { UpdatePostUseCase } from "../../../../application/usecases/posts/update-post-use-case";
import { DeletePostUseCase } from "../../../../application/usecases/posts/delete-post-use-case";
import { Request, Response } from "express";

export class PostController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private listPostsUseCase: ListPostsUseCase,
    private getPostByIdUseCase: GetPostByIdUseCase,
    private searchPostsUseCase: SearchPostsUseCase,
    private updatePostUseCase: UpdatePostUseCase,
    private deletePostUseCase: DeletePostUseCase
  ) {}

//   async create(req: Request, res: Response): Promise<Response> {
//     try {
//       const post = await this.createPostUseCase.execute(req.body);
//       return res.status(201).json(post);
//     } catch (error) {
//       if (error instanceof Error) {
//         return res.status(400).json({ error: error.message });
//       }
//       return res.status(500).json({ error: 'Erro interno do servidor' });
//     }
//   }

  async create(req: Request, res: Response): Promise<Response> {
    try {
        const { title, content, authorId, videoUrl, imageUrl, tags } = req.body;
        if (!title || !content || !authorId) {
            return res.status(400).json({ error: 'title, content e authorId são obrigatórios' });
        }

        const post = await this.createPostUseCase.execute({ title, content, authorId, videoUrl, imageUrl, tags: tags || [] });

        return res.status(201).json({message: 'Post criado com sucesso', data: post });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });   
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { search, tag, authorId, page, limit, sortBy, sortOrder } = req.query as Record<string, string>;

      if (search || tag || authorId || page || limit || sortBy || sortOrder) {
        const posts = await this.searchPostsUseCase.execute({
          search,
          tag,
          authorId,
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
          sortBy: (sortBy as any) || undefined,
          sortOrder: (sortOrder as any) || undefined,
        });
        return res.status(200).json(posts);
      }

      const posts = await this.listPostsUseCase.execute();
      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
      }
      const post = await this.getPostByIdUseCase.execute(id);
      return res.status(200).json(post);
    } catch (error) {
      const status = (error as any)?.status || 400;
      if (error instanceof Error) {
        return res.status(status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
      }
      const updated = await this.updatePostUseCase.execute(id, req.body);
      return res.status(200).json({ message: 'Post atualizado com sucesso', data: updated });
    } catch (error) {
      const status = (error as any)?.status || 400;
      if (error instanceof Error) {
        return res.status(status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ error: 'Parâmetro id é obrigatório' });
      }
      await this.deletePostUseCase.execute(id);
      return res.status(204).send();
    } catch (error) {
      const status = (error as any)?.status || 400;
      if (error instanceof Error) {
        return res.status(status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
