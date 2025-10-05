import { AppError } from '@/shared/errors/app-error';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateParams = (schema: z.ZodType<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
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
      return next(error);
    }
  };
};
