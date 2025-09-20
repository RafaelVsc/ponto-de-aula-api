import { Post } from '../../../domain/entities/Post';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { AppError } from '../../../shared/errors/app-error';

export class GetPostByIdUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<Post | null> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    return post;
  }
}
