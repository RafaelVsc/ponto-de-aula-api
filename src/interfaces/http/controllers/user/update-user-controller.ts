import { UpdateUserUseCase } from "@/application/usecases/users/update-user-use-case";
import { Request, Response, NextFunction } from "express";

export class UpdateUserController {
    constructor(private updateUserUseCase: UpdateUserUseCase) { }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = req.params.id;
            
            // Validação apenas do parâmetro de URL, já que o body é validado pelo middleware
            if (!userId) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'ID do usuário é obrigatório'
                });
            }

            const updated = await this.updateUserUseCase.execute(userId, req.body);
            
            return res.status(200).json({
                status: 'success',
                message: 'Usuário atualizado com sucesso',
                data: updated
            });
        } catch (error) {
            return next(error)
        }
    }
}