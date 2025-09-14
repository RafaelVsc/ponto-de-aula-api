import { Post } from "../../../domain/entities/Post";
import { PostRepository } from "../../../domain/repositories/post-repository";

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string, data: Partial<Post>): Promise<Post> {
    const updated = await this.postRepository.update(id, data);
    if (!updated) {
      const err = new Error('Post não localizado');
      (err as any).status = 404;
      throw err;
    }
    return updated;
  }
}

