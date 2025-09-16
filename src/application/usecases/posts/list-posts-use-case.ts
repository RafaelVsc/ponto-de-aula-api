import { Post } from '../../../domain/entities/Post';
import { PostRepository } from '../../../domain/repositories/post-repository';

export class ListPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }
}
