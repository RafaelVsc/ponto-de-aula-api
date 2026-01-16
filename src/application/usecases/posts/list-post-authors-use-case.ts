import { PostAuthorDTO } from '@/application/dto/PostDTO';
import { PostRepository } from '@/domain/repositories/posts/post-repository';

export class ListPostAuthorsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<PostAuthorDTO[]> {
    const authors = await this.postRepository.findAuthors();
    return authors.map(author => ({
      id: author.id,
      name: author.name,
      totalPosts: author.totalPosts,
    }));
  }
}
