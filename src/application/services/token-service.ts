import { UserRole } from "@/domain/entities/User";

export type TokenSignPayload = {id: string; role: UserRole}
export type TokenPayload = {sub: string; role: UserRole}

export interface TokenService {
    sign(payload: TokenSignPayload): string;
    verify(token: string): TokenPayload;
}