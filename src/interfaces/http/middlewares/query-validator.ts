import { AppError } from '@/shared/errors/app-error';
import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

export const validateQuery = (schema: z.ZodType<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
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
