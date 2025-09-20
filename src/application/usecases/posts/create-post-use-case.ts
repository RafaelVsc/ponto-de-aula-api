import { Post } from '../../../domain/entities/Post';
import { PostRepository } from '../../../domain/repositories/posts/post-repository';
import { CreatePostInputDTO, CreatePostOutputDTO } from '../../dto/CreatePostDTO';

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(post: CreatePostInputDTO): Promise<CreatePostOutputDTO> {
    const { title, content, authorId, videoUrl, imageUrl, tags = ['post'] } = post;
    const newPost: Post = {
      title,
      content,
      authorId,
      videoUrl,
      imageUrl,
      tags,
    };
    const createdPost = await this.postRepository.create(newPost);

    // Retornando apenas o ID conforme definido no OutputDTO
    return {
      id: createdPost.id as string,
    };
  }
}
