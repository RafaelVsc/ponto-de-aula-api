// src/interfaces/http/middlewares/authorize.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/app-error';

type AuthContext = { id: string; role: UserRole };

const getAuth = (res: Response): AuthContext => {
  const auth = res.locals.auth as AuthContext | undefined;
  if (!auth) throw new AppError('Authentication required', 401);
  return auth;
};

export const authorize =
  (...allowed: UserRole[]) =>
  (_req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(res);

    if (!allowed.includes(auth.role) && auth.role !== UserRole.ADMIN) {
      throw new AppError('Forbidden', 403);
    }
    return next();
  };
