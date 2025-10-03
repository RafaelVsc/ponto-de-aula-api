import { UserRole } from '@/domain/entities/User';
import { PostRepository } from '@/domain/repositories/posts/post-repository';
import { AppError } from '@/shared/errors/app-error';

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) { }

  async execute(id: string, userId: string, role: UserRole): Promise<void> {
    const postId = await this.postRepository.findById(id);
    if (!postId) { throw new AppError('Post not found', 404) }

    if (role !== UserRole.ADMIN && postId.authorId !== userId) {
      throw new AppError('Forbidden: only the author or admin can delete this post', 403);
    }
    await this.postRepository.delete(id);
  }
}
