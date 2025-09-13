import { Router } from 'express';
import { PostController } from '../http/controllers/posts/post-controller';

export default (router: Router, postController: PostController): void => {
  router.post('/', (req, res) => postController.create(req, res));
}