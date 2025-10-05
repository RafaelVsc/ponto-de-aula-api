import { PostOutputDTO } from '@/application/dto/PostDTO';
import { postToOutputDTO } from '@/application/mappers/post-mapper';
import { Post } from '@/domain/entities/Post';
import { PostRepository } from '@/domain/repositories/posts/post-repository';
import { AppError } from '@/shared/errors/app-error';

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) { }

  async execute(id: string, data: Partial<Post>, userId: string): Promise<PostOutputDTO> {
    const post = await this.postRepository.findById(id)
    if (!post) { throw new AppError('Post not found', 404) }

    if(post.authorId !== userId) {
      throw new AppError('Forbidden: only author can update this post', 403)
    }

    const updated = await this.postRepository.update(id, data);
    if (!updated) {
      throw new AppError('Post not found', 404);
    }
    return postToOutputDTO(updated);
  }
}
