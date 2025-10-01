import { Request, Response, NextFunction } from "express"
import { JwtService } from "@/infrastructure/security/jwt-service"
import { AppError } from "@/shared/errors/app-error"

const jwtService = new JwtService();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401);
    }

    const token = header.slice(7).trim();
    const payload = jwtService.verify(token);

    res.locals.auth = { userId: payload.sub, role: payload.role }
    next()
  } catch (error) {
    next(error)
  }
}