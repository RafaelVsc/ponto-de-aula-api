import { AppError } from '@/shared/errors/app-error';
import { Post } from '../../../domain/entities/Post';
import { FindPostsParams } from '../../../domain/repositories/posts/find-posts-params';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';

export class SearchPostsUseCase {
  constructor(private postRepository: PostRepository) { }

  async execute(params: FindPostsParams): Promise<Post[]> {
    // validação defensiva: authorId opcional e string quando presente
    if (params.authorId !== undefined && typeof params.authorId !== 'string') {
      throw new AppError('Invalid authorId', 400);
    }

    return this.postRepository.findAll(params);
  }
}
