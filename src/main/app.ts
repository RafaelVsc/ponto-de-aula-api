import { getPrismaClient } from '@/infrastructure/database/prisma/prisma-client';
import { PrismaPostRepository } from '@/infrastructure/repositories/prisma-post-repository';
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user-repository';
import { JwtService } from '@/infrastructure/security/jwt-service';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { errorHandler, notFound } from '@/interfaces/http/middlewares/error-handler';
import { buildPostsModule } from '@/main/modules/posts/posts.module';
import express from 'express';
import { buildAuthModule } from './modules/auth/auth.module';
import { buildUserModule } from './modules/users/users.module';

export function buildApp() {
  const app = express();

  // Middlewares
  app.use(express.json());

  const prisma = getPrismaClient();


  const userRepository = new PrismaUserRepository(prisma);
  const postRepository = new PrismaPostRepository(prisma);
  const jwtService = new JwtService();

  // Routes
  app.use('/auth/', buildAuthModule(userRepository, jwtService));

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.json({ message: 'API Tech Challenge Fase 2 - FIAP' });
  });

  app.use(authenticate(jwtService));
  app.use('/posts', buildPostsModule(postRepository));
  app.use('/users', buildUserModule(userRepository));

  // 404 + Error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
