import { PostRepository } from "../../../domain/repositories/post-repository";

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.postRepository.findById(id);
    if (!existing) {
      const err = new Error('Post não localizado');
      (err as any).status = 404;
      throw err;
    }
    await this.postRepository.delete(id);
  }
}

