import { TokenPayload, TokenService, TokenSignPayload } from '@/application/services/token-service';
import { UserRole } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/app-error';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export class JwtService implements TokenService {
  private readonly secret: string;

  constructor(
    secret = process.env.JWT_SECRET,
    private readonly expiresIn = process.env.JWT_EXPIRES_IN ?? '15m',
  ) {
    this.secret = JwtService.resolveSecret(secret);
  }

  private static resolveSecret(secret: string | undefined): string {
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
      if (secret && secret.trim()) return secret;
      throw new AppError('JWT secret is not defined', 500);
    }

    // Não usar JWT_SECRET fora de produção para evitar divergências
    if (secret && secret.trim()) {
      console.warn(
        'JWT_SECRET defined but ignored in non-production — using fallback for dev/test',
      );
    } else {
      console.warn('JWT_SECRET not set — using fallback secret for dev/test');
    }
    return 'dev-secret';
  }

  sign({ id, role }: TokenSignPayload): string {
    const options = { subject: id, expiresIn: this.expiresIn } as jwt.SignOptions;
    return jwt.sign({ role }, this.secret, options);
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload & { role?: string };
      if (
        !decoded.sub ||
        !decoded.role ||
        !Object.values(UserRole).includes(decoded.role as UserRole)
      ) {
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
