import express from 'express';
import { buildPostsModule } from '@/main/modules/posts/posts.module';
import { errorHandler, notFound } from '@/interfaces/http/middlewares/error-handler';
import { buildUserModule } from './modules/users/users.module';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';

export function buildApp() {
  const app = express();

  // Middlewares
  app.use(express.json());

  // Routes
  app.use('/posts', buildPostsModule());
  app.use('/users', buildUserModule());
  app.use(authenticate)

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.json({ message: 'API Tech Challenge Fase 2 - FIAP' });
  });

  // 404 + Error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
