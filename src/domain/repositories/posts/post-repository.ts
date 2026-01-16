import { Post } from '../../entities/Post';
import { FindPostsParams } from './find-posts-params';

export interface FindPostsResult {
  items: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface PostAuthorSummary {
  id: string;
  name: string;
  totalPosts: number;
}

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findAll(params?: FindPostsParams): Promise<FindPostsResult>;
  findAuthors(): Promise<PostAuthorSummary[]>;
  create(post: Post): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post | null>;
  delete(id: string): Promise<void>;
}
