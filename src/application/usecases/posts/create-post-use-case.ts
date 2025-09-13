import { Post } from "../../../domain/entities/Post";
import { PostRepository } from "../../../domain/repositories/post-repository";
import { CreatePostInputDTO } from "../../dto/CreatePostDTO";

export class CreatePostUseCase {
    constructor(private postRepository: PostRepository) {}

    async execute(post: CreatePostInputDTO): Promise<Post> {
        const { title, content, authorId, videoUrl, imageUrl } = post;
        const newPost: Post = {
            title,
            content,
            authorId,
            videoUrl,
            imageUrl,
            tags: ["post"]
        }
        const response = await this.postRepository.create(newPost);
        return response;
    }
} 