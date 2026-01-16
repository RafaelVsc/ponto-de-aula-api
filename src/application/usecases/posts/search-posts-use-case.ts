import { AppError } from '@/shared/errors/app-error';
import { FindPostsParams } from '../../../domain/repositories/posts/find-posts-params';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { postsToOutputDTO } from '@/application/mappers/post-mapper';
import { PaginatedPostsOutputDTO } from '@/application/dto/PostDTO';

export class SearchPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(params: FindPostsParams): Promise<PaginatedPostsOutputDTO> {
    // validação defensiva: authorId opcional e string quando presente
    if (params.authorId !== undefined && typeof params.authorId !== 'string') {
      throw new AppError('Invalid authorId', 400);
    }

    const result = await this.postRepository.findAll(params);
    const data = postsToOutputDTO(result.items);

    const totalPages = result.limit > 0 ? Math.ceil(result.total / result.limit) : 0;

    return {
      data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPreviousPage: result.page > 1 && result.total > 0,
      },
    };
  }
}
