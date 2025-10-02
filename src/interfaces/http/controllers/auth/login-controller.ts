import { LoginUseCase } from "@/application/usecases/auth/login-use-case";
import { NextFunction, Request, Response } from "express";


export class LoginController {
    constructor(private loginUseCase: LoginUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const authResult = await this.loginUseCase.execute(req.body);
            return res.status(200).json({
                status: 'success',
                message: 'Login',
                data: authResult
            })
        } catch (error) {
            return next(error)
        }
    }
}