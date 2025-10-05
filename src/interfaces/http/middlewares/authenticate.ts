import { Request, Response, NextFunction } from "express"
import { JwtService } from "@/infrastructure/security/jwt-service"
import { AppError } from "@/shared/errors/app-error"
import { UserRole } from "@/domain/entities/User";

type AuthContext = {
  id: string;
  role: UserRole;
}

const jwtService = new JwtService();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }
  try {

    const token = header.slice(7).trim();
    const payload = jwtService.verify(token);

    const auth: AuthContext = { id: payload.sub, role: payload.role }
    res.locals.auth = auth

    return next()
  } catch (error) {
    next(error)
  }
}