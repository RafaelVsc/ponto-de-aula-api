import { PostOutputDTO } from '@/application/dto/PostDTO';
import { postToOutputDTO } from '@/application/mappers/post-mapper';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { AppError } from '../../../shared/errors/app-error';

export class GetPostByIdUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<PostOutputDTO> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return postToOutputDTO(post);
  }
}
