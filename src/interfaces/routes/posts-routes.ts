import { CreatePostController } from '@/interfaces/http/controllers/posts/create-post-controller';
import { DeletePostController } from '@/interfaces/http/controllers/posts/delete-post-controller';
import { ListAllPostsController } from '@/interfaces/http/controllers/posts/find-posts-controller';
import { UpdatePostController } from '@/interfaces/http/controllers/posts/update-post-controller';
import { validate } from '@/interfaces/http/middlewares/validation-middleware';
import { createPostSchema } from '@/interfaces/http/validators/post/create-post-validator';
import { updatePostSchema } from '@/interfaces/http/validators/post/update-post-validator';
import { Router } from 'express';

export default (
  router: Router,
  postController: CreatePostController,
  listPostController: ListAllPostsController,
  updatePostController: UpdatePostController,
  deletePostController: DeletePostController,
): void => {
  // Rota POST com middleware de validação Zod
  router.post('/', validate(createPostSchema), (req, res, next) => postController.create(req, res, next));
  router.get('/', (req, res, next) => listPostController.listAll(req, res, next));
  router.get('/:id', (req, res, next) => listPostController.findById(req, res, next));
  router.patch('/:id', validate(updatePostSchema), (req, res, next) =>
    updatePostController.update(req, res, next),
  );
  router.delete('/:id', (req, res, next) => deletePostController.delete(req, res, next));
};
