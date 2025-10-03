import { FindUserUseCase } from "@/application/usecases/users/find-user-use-case";
import { Request, Response, NextFunction } from "express";


export class FindUserController {
    constructor(
        private findUserUseCase: FindUserUseCase,
    ) { }

    async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = req.params.id as string;
            const foundUser = await this.findUserUseCase.execute(userId);
            return res.status(200).json({ data: foundUser });
        } catch (error) {
            next(error)
        }
    }
}