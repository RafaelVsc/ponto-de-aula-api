import { PostOutputDTO } from '@/application/dto/PostDTO';
import { postsToOutputDTO } from '@/application/mappers/post-mapper';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';

export class ListPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<PostOutputDTO[]> {
    const posts = await this.postRepository.findAll();
    return postsToOutputDTO(posts);
  }
}
