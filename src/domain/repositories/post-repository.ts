import { Post } from '../entities/Post';
import { FindPostsParams } from './find-posts-params';

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findAll(params?: FindPostsParams): Promise<Post[]>;
  create(post: Post): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post | null>;
  delete(id: string): Promise<void>;
}

// mudar o findPostMParams ou criar nesse arquivo
