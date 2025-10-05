import { ChangePasswordUseCase } from '@/application/usecases/users/change-password-use-case';
import { UserRole } from '@/domain/entities/User';
import { Request, Response, NextFunction } from 'express';

export class ChangePasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) { }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const currentUser = res.locals.auth as { id: string; role: UserRole } | undefined;
      
      if (!currentUser || !currentUser.id) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Authentication required' 
        });
      }

      const result = await this.changePasswordUseCase.execute(currentUser.id, req.body);
      
      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }
}