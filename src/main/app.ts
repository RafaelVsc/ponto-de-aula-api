import { getPrismaClient } from '@/infrastructure/database/prisma/prisma-client';
import { JwtService } from '@/infrastructure/security/jwt-service';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { errorHandler, notFound } from '@/interfaces/http/middlewares/error-handler';
import { buildPostsModule } from '@/main/modules/posts/posts.module';
import express from 'express';
import cors from 'cors';
import { buildAuthModule } from './modules/auth/auth.module';
import { makePostRepository } from './modules/posts/post-repository-factory';
import { makeUserRepository } from './modules/users/user-repository-factory';
import { buildUserModule } from './modules/users/users.module';
import { setupSwagger } from './config/swagger.config';

export function buildApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',');

  const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  };

  app.use(cors(corsOptions));

  // Middlewares
  app.use(express.json());

  // configure swagger
  setupSwagger(app);

  const prisma = getPrismaClient();

  const userRepository = makeUserRepository(prisma);
  const postRepository = makePostRepository(prisma);
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
