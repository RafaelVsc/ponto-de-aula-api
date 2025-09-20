import { Router } from 'express';
import { CreatePostController } from '../http/controllers/posts/create-post-controller';
import { ListAllPostsController } from '../http/controllers/posts/find-posts-controller';
import { UpdatePostController } from '../http/controllers/posts/update-post-controller';
import { DeletePostController } from '../http/controllers/posts/delete-post-controller';

export default (
  router: Router,
  postController: CreatePostController,
  listPostController: ListAllPostsController,
  updatePostController: UpdatePostController,
  deletePostController: DeletePostController,
): void => {
  router.post('/', (req, res) => postController.create(req, res));
  router.get('/', (req, res) => listPostController.listAll(req, res));
  router.get('/:id', (req, res) => listPostController.findById(req, res));
  router.patch('/:id', (req, res) => updatePostController.update(req, res));
  router.delete('/:id', (req, res) => deletePostController.delete(req, res));
};
