import { Post } from "../../domain/entities/Post";
import { FindPostsParams } from "../../domain/repositories/find-posts-params";
import { PostRepository } from "../../domain/repositories/post-repository";

export class InMemoryPostRepository implements PostRepository {
    private posts: Post[] = [];
    
    findById(id: string): Promise<Post | null> {
        throw new Error("Method not implemented.");
    }
    findAll(params?: FindPostsParams): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    update(id: string, data: Partial<Post>): Promise<Post | null> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }


    async create(post: Post): Promise<Post> {
        const newPost = { ...post, id: (Math.random() * 10000).toFixed(0) };
        this.posts.push(newPost);
        return newPost;
    }
}