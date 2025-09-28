import { Post } from '../../domain/entities/Post';
import { FindPostsParams } from '../../domain/repositories/posts/find-posts-params';
import { PostRepository } from '../../domain/repositories/posts/post-repository';
import { randomUUID } from 'crypto';

export class InMemoryPostRepository implements PostRepository {
  private posts: Post[] = [];

  async findById(id: string): Promise<Post | null> {
    return this.posts.find(post => post.id === id) ?? null;
  }

  async findAll(params?: FindPostsParams): Promise<Post[]> {
    if (!params) return [...this.posts];

    let filteredPosts = [...this.posts];

    // 🔍 Busca por texto (title ou content, contains)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower),
      );
    }

    // 🏷️ Filtrar por tag (case-insensitive)
    if (params.tag) {
      const tagLower = params.tag.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.tags?.some(t => t.toLowerCase() === tagLower),
      );
    }

    // 👤 Filtrar por autor
    if (params.authorId) {
      filteredPosts = filteredPosts.filter(post => post.authorId === params.authorId);
    }

    // 🗂️ Ordenação
    if (params.sortBy) {
      filteredPosts.sort((a, b) => {
        if (params.sortBy === 'title') {
          return params.sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }
        if (params.sortBy === 'createdAt') {
          const dateA = a.createdAt ?? new Date(0);
          const dateB = b.createdAt ?? new Date(0);
          return params.sortOrder === 'desc'
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
    }

    // 📄 Paginação (offset)
    if (params.page !== undefined && params.limit !== undefined) {
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = startIndex + params.limit;
      filteredPosts = filteredPosts.slice(startIndex, endIndex);
    }

    return filteredPosts;
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return null;

    const now = new Date();
    const current = this.posts[index]!;
    const updated: Post = {
      ...current,
      ...data,
      updatedAt: now,
    };

    this.posts[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.posts = this.posts.filter(post => post.id !== id);
  }

  async create(post: Post): Promise<Post> {
    const now = new Date();
    const newPost: Post = {
      ...post,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      tags: post.tags ?? [],
    };
    this.posts.push(newPost);
    return newPost;
  }
}
