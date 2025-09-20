import { Post } from '../../../domain/entities/Post';
import { FindPostsParams } from '../../../domain/repositories/posts/find-posts-params';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';

export class SearchPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(params: FindPostsParams): Promise<Post[]> {
    return this.postRepository.findAll(params);
  }
}
