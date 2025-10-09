import { AppError } from '@/shared/errors/app-error';
import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

export const validateQuery = (schema: z.ZodType<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Valida os dados da query string usando o esquema do Zod
      const parsed = schema.parse(req.query);

       // Substitui req.query pelo objeto validado e tipado
      (req as any).query = parsed;

      // Passa o controle para o próximo middleware/controller
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            'Invalid query request',
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
