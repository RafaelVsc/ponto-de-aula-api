import express, { Router } from 'express';
import postsRoutes from '../interfaces/routes/posts-routes';
import { PostController } from '../interfaces/http/controllers/posts/post-controller';
import { CreatePostUseCase } from '../application/usecases/posts/create-post-use-case';
import { InMemoryPostRepository } from '../infrastructure/database/inMemoryPostRepository';
import { ListPostsUseCase } from '../application/usecases/posts/list-posts-use-case';
import { GetPostByIdUseCase } from '../application/usecases/posts/get-posts-by-id-use-case';
import { SearchPostsUseCase } from '../application/usecases/posts/search-posts-use-case';
import { UpdatePostUseCase } from '../application/usecases/posts/update-post-use-case';
import { DeletePostUseCase } from '../application/usecases/posts/delete-post-use-case';
import { errorHandler, notFound } from '../interfaces/http/middlewares/error-handler';

export function buildApp() {
  const app = express();

  // Middlewares
  app.use(express.json());

  // DI container (simple manual wiring)
  const postRepository = new InMemoryPostRepository();
  const createPostUseCase = new CreatePostUseCase(postRepository);
  const listPostsUseCase = new ListPostsUseCase(postRepository);
  const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
  const searchPostsUseCase = new SearchPostsUseCase(postRepository);
  const updatePostUseCase = new UpdatePostUseCase(postRepository);
  const deletePostUseCase = new DeletePostUseCase(postRepository);

  const postController = new PostController(
    createPostUseCase,
    listPostsUseCase,
    getPostByIdUseCase,
    searchPostsUseCase,
    updatePostUseCase,
    deletePostUseCase
  );

  // Routes
  const router = Router();
  postsRoutes(router, postController);
  app.use('/posts', router);

  app.get('/', (_req, res) => {
    res.json({ message: 'API Tech Challenge Fase 2 - FIAP' });
  });

  // 404 + Error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

