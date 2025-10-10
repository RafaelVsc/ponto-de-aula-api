import { AppError } from '@/shared/errors/app-error';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateParams = (schema: z.ZodType<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Valida os dados da query string usando o esquema do Zod
      const parsed = schema.parse(req.params);

      // Substitui req.params pelo objeto validado e tipado
      (req as any).params = parsed;
      next();
    } catch (error) {
      // Se houver erro de validação, retorna 400 com formato simplificado
      if (error instanceof ZodError) {
        return next(
          new AppError(
            'Invalid route params',
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
