import { PostOutputDTO } from '@/application/dto/PostDTO';
import { postToDetailedDTO } from '@/application/mappers/post-mapper';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { AppError } from '../../../shared/errors/app-error';

export class GetPostByIdUseCase {
  constructor(
    private postRepository: PostRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<PostOutputDTO> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Enriquecer com o nome do autor se possível (proteção contra userRepository undefined)
    let authorName: string | undefined;
    if (post.authorId) {
      const author = await this.userRepository.findById(post.authorId);
      console.log(author)
      if (author) {
        authorName = author.name;
      }
    }
    return postToDetailedDTO(post, authorName);
  }
}
