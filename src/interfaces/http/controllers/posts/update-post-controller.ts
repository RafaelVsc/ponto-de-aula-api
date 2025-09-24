import { Request, Response, NextFunction } from 'express';
import { UpdatePostUseCase } from '@/application/usecases/posts/update-post-use-case';

export class UpdatePostController {
  constructor(private updatePostUseCase: UpdatePostUseCase) {}

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const postId = req.params.id;
      if (!postId) {
        return next()
      }

      const updated = await this.updatePostUseCase.execute(postId, req.body);
      return res.status(200).json({ data: updated });
    } catch (error) {
      return next(error)
    }
  }
}
