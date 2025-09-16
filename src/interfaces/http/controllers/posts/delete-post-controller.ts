import { DeletePostUseCase } from "../../../../application/usecases/posts/delete-post-use-case";
import { Request, Response } from "express";

export class DeletPostController {
    constructor(private deletePostUseCase: DeletePostUseCase) { }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const postId = req.params.id;
            if (!postId) {
                return res.status(400).json({ error: 'Parâmetro id é obrigatório' })
            }

            await this.deletePostUseCase.execute(postId);
            return res.status(204).send();
        } catch (error) {
            const status = (error as any)?.status || 400;
            if (error instanceof Error) {
                return res.status(status).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}