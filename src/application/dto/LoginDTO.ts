import { User } from "@/domain/entities/User";

export interface LoginUserInputDTO {
    email?: string;
    username?: string;
    password: string;
}

export interface LoginOutPutDTO {
    token: string;
    user: Omit<User, 'password'>;
}