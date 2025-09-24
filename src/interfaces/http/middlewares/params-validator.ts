import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateParams = (schema: z.ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      // Se houver erro de validação, retorna 400 com formato simplificado
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Dados de entrada inválidos',
          //   errors: error.issues
          errors: error.issues.map(err => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  }
}