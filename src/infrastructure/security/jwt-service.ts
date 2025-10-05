import { UserRole } from "@/domain/entities/User";
import { AppError } from '@/shared/errors/app-error';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';


export type SignPayload = { id: string; role: UserRole };

interface TokenPayload {
    sub: string;
    role: UserRole
}


export class JwtService {
    private readonly secret: string;

    constructor(
        secret = process.env.JWT_SECRET,
        private readonly expiresIn = process.env.JWT_EXPIRES_IN ?? '15m',
    ) {
        this.secret = JwtService.resolveSecret(secret);
    }


    private static resolveSecret(secret: string | undefined): string {
        if (secret && secret.trim()) return secret;
        if (process.env.NODE_ENV === 'production') {
            throw new AppError('JWT secret is not defined', 500);
        }
        console.warn('JWT_SECRET not set — using fallback secret for dev/test');
        return 'dev-secret';
    }

    sign({ id, role }: SignPayload): string {
        const options = { subject: id, expiresIn: this.expiresIn } as jwt.SignOptions;
        return jwt.sign({ role }, this.secret, options);
    }

    verify(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload & { role?: string };
            if (!decoded.sub || !decoded.role || !Object.values(UserRole).includes(decoded.role as UserRole)) {
                throw new AppError('Invalid token payload', 401);
            }
            return { sub: decoded.sub as string, role: decoded.role as UserRole };
        } catch (error) {
            // Tratamento específico dos erros JWT
            if (error instanceof TokenExpiredError) {
                throw new AppError('Token expired', 401);
            }
            if (error instanceof JsonWebTokenError) {
                throw new AppError('Invalid token', 401);
            }
            throw new AppError('Invalid or expired token', 401);
        }
    }
}