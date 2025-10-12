import { TokenService } from '@/application/services/token-service';
import { UserRole } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/app-error';
import { NextFunction, Request, Response } from 'express';

type AuthContext = {
  id: string;
  role: UserRole;
};

export const authenticate =
  (tokenService: TokenService) => (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401));
    }
    try {
      const token = header.slice(7).trim();
      const payload = tokenService.verify(token);

      const auth: AuthContext = { id: payload.sub, role: payload.role };
      res.locals.auth = auth;

      return next();
    } catch (error) {
      next(error);
    }
  };
