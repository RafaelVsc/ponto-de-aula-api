import { FindUserUseCase } from "@/application/usecases/users/find-user-use-case";
import { Request, Response, NextFunction } from "express";


export class FindUserController {
    constructor(
        private findUserUseCase: FindUserUseCase,
    ) { }

    async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = req.params.id as string;
            const currentUser = res.locals.auth; // pega id e role do usuário autenticado
            const foundUser = await this.findUserUseCase.execute(userId, currentUser);
            return res.status(200).json({ data: foundUser });
        } catch (error) {
            next(error)
        }
    }

    async findMe(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const currentUser = res.locals.auth;
            console.log(currentUser)
            const foundUser = await this.findUserUseCase.execute(currentUser.id, currentUser);
            return res.status(200).json({ data: foundUser });
        } catch (error) {
            next(error)
        }
    }
}