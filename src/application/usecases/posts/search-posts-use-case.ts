import { AppError } from '@/shared/errors/app-error';
import { FindPostsParams } from '../../../domain/repositories/posts/find-posts-params';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { postsToOutputDTO } from '@/application/mappers/post-mapper';
import { PostOutputDTO } from '@/application/dto/PostDTO';

export class SearchPostsUseCase {
  constructor(private postRepository: PostRepository) { }

  async execute(params: FindPostsParams): Promise<PostOutputDTO[]> {
    // validação defensiva: authorId opcional e string quando presente
    if (params.authorId !== undefined && typeof params.authorId !== 'string') {
      throw new AppError('Invalid authorId', 400);
    }

    const posts = await this.postRepository.findAll(params);
    return postsToOutputDTO(posts)
  }
}
