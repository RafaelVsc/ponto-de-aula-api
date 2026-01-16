import { PaginatedPostsOutputDTO } from '@/application/dto/PostDTO';
import { postsToOutputDTO } from '@/application/mappers/post-mapper';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';

export class ListPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<PaginatedPostsOutputDTO> {
    const result = await this.postRepository.findAll();
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
