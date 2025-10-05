import { AppError } from '@/shared/errors/app-error';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Middleware de validação simplificado com Zod
export const validateBody = (schema: z.ZodType<any>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Valida o corpo da requisição com o schema fornecido
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      // Se houver erro de validação, retorna 400 com formato simplificado
      if (error instanceof ZodError) {
        return next(
          new AppError(
            'Invalid request',
            400,
            error.issues.map(issue => ({
              path: issue.path,
              message: issue.message,
            })),
          ),
        );
      }

      // Para outros tipos de erro, passa para o próximo middleware
      return next(error);
    }
  };
};
