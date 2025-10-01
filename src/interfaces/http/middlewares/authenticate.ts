import { Request, Response, NextFunction } from "express"
import { JwtService } from "@/infrastructure/security/jwt-service"
import { AppError } from "@/shared/errors/app-error"
import { UserRole } from "@/domain/entities/User"

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: UserRole };
}

export const authenticate = (jwtService: JwtService) => (
    req: Request, _res: Response, next: NextFunction,
) => {
    const header = req.headers.authorization;
    if(!header?.startsWith('Bearer ')) throw new AppError('Authentication required', 401);

    const token = header.substring('Bearer '.length).trim();
    const payload = jwtService.verify(token);

    req.user = {id: payload.sub, role: payload.role};
    return next();

}