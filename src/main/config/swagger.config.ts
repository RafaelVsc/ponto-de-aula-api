import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { swaggerDocument } from '@/main/docs/swagger';

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.warn('📘 Swagger disponível em: http://localhost:3000/api-docs');
}
