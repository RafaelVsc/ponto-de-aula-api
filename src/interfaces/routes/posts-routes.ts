import { UserRole } from '@/domain/entities/User';
import { CreatePostController } from '@/interfaces/http/controllers/posts/create-post-controller';
import { DeletePostController } from '@/interfaces/http/controllers/posts/delete-post-controller';
import { ListAllPostsController } from '@/interfaces/http/controllers/posts/find-posts-controller';
import { UpdatePostController } from '@/interfaces/http/controllers/posts/update-post-controller';
import { authorize } from '@/interfaces/http/middlewares/authorize';
import { validateParams } from '@/interfaces/http/middlewares/params-validator';
import { validateQuery } from '@/interfaces/http/middlewares/query-validator';
import { validateBody } from '@/interfaces/http/middlewares/validation-middleware';
import { uuidParamSchema } from '@/interfaces/http/validators/common/route-params-validator';
import { createPostSchema } from '@/interfaces/http/validators/post/create-post-validator';
import { searchQuerySchema } from '@/interfaces/http/validators/post/search-post-validator';
import { updatePostSchema } from '@/interfaces/http/validators/post/update-post-validator';
import { Router } from 'express';

export default (
  router: Router,
  createPostController: CreatePostController,
  listPostController: ListAllPostsController,
  updatePostController: UpdatePostController,
  deletePostController: DeletePostController,
): void => {
  // Rota POST com middleware de validação Zod
  router.post('/',
    authorize(UserRole.ADMIN, UserRole.SECRETARY, UserRole.TEACHER),
    validateBody(createPostSchema),
    (req, res, next) => createPostController.create(req, res, next));

  router.get('/', validateQuery(searchQuerySchema), (req, res, next) => listPostController.search(req, res, next));
  
  router.get('/mine',
    validateQuery(searchQuerySchema),
    authorize(UserRole.ADMIN, UserRole.SECRETARY, UserRole.TEACHER),
    (req, res, next) => listPostController.myPosts(req, res, next));


  router.get('/:id', validateParams(uuidParamSchema), (req, res, next) => listPostController.findById(req, res, next));
  // Novo endpoint: GET /posts/mine — retorna apenas os posts do autor autenticado

  router.patch('/:id',
    validateParams(uuidParamSchema),
    validateBody(updatePostSchema),
    authorize(UserRole.ADMIN, UserRole.SECRETARY, UserRole.TEACHER),
    (req, res, next) => updatePostController.update(req, res, next),
  );
  router.delete('/:id',
    authorize(UserRole.ADMIN, UserRole.SECRETARY, UserRole.TEACHER),
    validateParams(uuidParamSchema),
    (req, res, next) => deletePostController.delete(req, res, next));
};
