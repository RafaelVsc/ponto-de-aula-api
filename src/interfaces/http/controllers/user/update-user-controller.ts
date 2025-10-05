import { UpdateUserUseCase } from '@/application/usecases/users/update-user-use-case';
import { UserRole } from '@/domain/entities/User';
import { Request, Response, NextFunction } from 'express';

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = req.params.id;

      // Validação apenas do parâmetro de URL, já que o body é validado pelo middleware
      if (!userId) {
        return res.status(400).json({
          status: 'error',
          message: 'ID do usuário é obrigatório',
        });
      }

      // Usar tipagem explícita para garantir compatibilidade com o use case
      const currentUser = res.locals.auth as { id: string; role: UserRole } | undefined;
      if (!currentUser || !currentUser.id) {
        return res.status(401).json({ status: 'error', message: 'Authentication required' });
      }

      const updated = await this.updateUserUseCase.execute(userId, req.body, currentUser);

      return res.status(200).json({
        status: 'success',
        message: 'Usuário atualizado com sucesso',
        data: updated,
      });
    } catch (error) {
      return next(error);
    }
  }
}
