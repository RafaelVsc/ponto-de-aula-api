import { Post } from '../../domain/entities/Post';
import { FindPostsParams } from '../../domain/repositories/posts/find-posts-params';
import {
  FindPostsResult,
  PostAuthorSummary,
  PostRepository,
} from '../../domain/repositories/posts/post-repository';
import { randomUUID } from 'crypto';

export class InMemoryPostRepository implements PostRepository {
  private posts: Post[] = [];

  async findById(id: string): Promise<Post | null> {
    return this.posts.find(post => post.id === id) ?? null;
  }

  async findAll(params?: FindPostsParams): Promise<FindPostsResult> {
    if (!params) {
      const total = this.posts.length;
      const limit = Math.max(total, 1);
      return { items: [...this.posts], total, page: 1, limit };
    }

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

    const total = filteredPosts.length;

    // 📄 Paginação (offset)
    if (params.page !== undefined && params.limit !== undefined) {
      const safePage = Math.max(params.page, 1);
      const safeLimit = Math.max(params.limit, 1);
      const startIndex = (safePage - 1) * safeLimit;
      const endIndex = startIndex + safeLimit;
      filteredPosts = filteredPosts.slice(startIndex, endIndex);
      return {
        items: filteredPosts,
        total,
        page: safePage,
        limit: safeLimit,
      };
    }

    const limit = Math.max(params.limit ?? total, 1);
    return {
      items: filteredPosts,
      total,
      page: Math.max(params.page ?? 1, 1),
      limit,
    };
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

  async findAuthors(): Promise<PostAuthorSummary[]> {
    const authorsMap = new Map<string, { name: string; total: number }>();

    for (const post of this.posts) {
      const current = authorsMap.get(post.authorId) ?? { name: post.author ?? '', total: 0 };
      authorsMap.set(post.authorId, { name: current.name || post.author || '', total: current.total + 1 });
    }

    return Array.from(authorsMap.entries())
      .map(([id, { name, total }]) => ({
        id,
        name,
        totalPosts: total,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
