import { Router } from 'express';
import { PostController } from '../http/controllers/posts/post-controller';

export default (router: Router, postController: PostController): void => {
  router.post('/', (req, res) => postController.create(req, res));
  router.get('/', (req, res) => postController.list(req, res));
  router.get('/:id', (req, res) => postController.getById(req, res));
  router.patch('/:id', (req, res) => postController.update(req, res));
  router.delete('/:id', (req, res) => postController.delete(req, res));
}
