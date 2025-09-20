import { Post } from '../../../domain/entities/Post';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { AppError } from '../../../shared/errors/app-error';

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string, data: Partial<Post>): Promise<Post> {
    const updated = await this.postRepository.update(id, data);
    if (!updated) {
      throw new AppError('Post not found', 404);
    }
    return updated;
  }
}
