import { PostRepository } from '../../../domain/repositories/post-repository';
import { AppError } from '../../../shared/errors/app-error';

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new AppError('Post não localizado', 404);
    }
    await this.postRepository.delete(id);
  }
}
