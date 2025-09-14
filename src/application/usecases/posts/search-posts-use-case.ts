import { Post } from "../../../domain/entities/Post";
import { FindPostsParams } from "../../../domain/repositories/find-posts-params";
import { PostRepository } from "../../../domain/repositories/post-repository";

export class SearchPostsUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(params: FindPostsParams): Promise<Post[]> {
        return this.postRepository.findAll(params);
    }
}