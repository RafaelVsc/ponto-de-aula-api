import { Post } from "../../../domain/entities/Post";
import { PostRepository } from "../../../domain/repositories/post-repository";


export class GetPostByIdUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(id: string): Promise<Post | null> {
        const post = await this.postRepository.findById(id);

        if(!post) {
            throw new Error('Post não localizado');
        }
        return post;
    }
}