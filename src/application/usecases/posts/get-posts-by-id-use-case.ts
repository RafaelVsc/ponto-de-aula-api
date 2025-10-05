import { PostOutputDTO } from '@/application/dto/PostDTO';
import { postToOutputDTO } from '@/application/mappers/post-mapper';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { AppError } from '../../../shared/errors/app-error';
import { UserRepository } from '@/domain/repositories/users/user-repository';

export class GetPostByIdUseCase {
  constructor(private postRepository: PostRepository,
    private userRepository?: UserRepository
  ) { }

  async execute(id: string): Promise<PostOutputDTO> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Enriquecer com o nome do autor se possível (proteção contra userRepository undefined)
    let authorName: string | undefined;
    if (post.authorId && this.userRepository) {
      const author = await this.userRepository.findById(post.authorId);
      if (author) {
        authorName = author.name;
      }
    }
    return postToOutputDTO(post);
  }
}
