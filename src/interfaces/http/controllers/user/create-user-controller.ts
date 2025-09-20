import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { Request, Response } from 'express';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role, username } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'name, email, password e role são obrigatórios' });
      }

      const result = await this.createUserUseCase.execute({
        name,
        email,
        password,
        role,
        username,
      });

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
