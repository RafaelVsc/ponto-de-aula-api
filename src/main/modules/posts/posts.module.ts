// src/main/modules/posts/posts.module.ts
import { CreatePostUseCase } from '@/application/usecases/posts/create-post-use-case';
import { DeletePostUseCase } from '@/application/usecases/posts/delete-post-use-case';
import { GetPostByIdUseCase } from '@/application/usecases/posts/get-posts-by-id-use-case';
import { ListPostsUseCase } from '@/application/usecases/posts/list-posts-use-case';
import { SearchPostsUseCase } from '@/application/usecases/posts/search-posts-use-case';
import { UpdatePostUseCase } from '@/application/usecases/posts/update-post-use-case';
import { PostRepository } from '@/domain/repositories/posts/post-repository';
import { CreatePostController } from '@/interfaces/http/controllers/posts/create-post-controller';
import { DeletePostController } from '@/interfaces/http/controllers/posts/delete-post-controller';
import { ListAllPostsController } from '@/interfaces/http/controllers/posts/find-posts-controller';
import { UpdatePostController } from '@/interfaces/http/controllers/posts/update-post-controller';
import postsRoutes from '@/interfaces/routes/posts-routes';
import { Router } from 'express';

export function buildPostsModule(
  postRepository: PostRepository
): Router {
  // const postRepository = new InMemoryPostRepository();

  const createPostUseCase = new CreatePostUseCase(postRepository);
  const listPostsUseCase = new ListPostsUseCase(postRepository);
  const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
  const searchPostsUseCase = new SearchPostsUseCase(postRepository);
  const updatePostUseCase = new UpdatePostUseCase(postRepository);
  const deletePostUseCase = new DeletePostUseCase(postRepository);

  const postController = new CreatePostController(createPostUseCase);
  const listPostController = new ListAllPostsController(
    listPostsUseCase,
    getPostByIdUseCase,
    searchPostsUseCase,
  );
  const updatePostController = new UpdatePostController(updatePostUseCase);
  const deletePostController = new DeletePostController(deletePostUseCase);

  const router = Router();
  postsRoutes(
    router,
    postController,
    listPostController,
    updatePostController,
    deletePostController,
  );
  return router;
}
