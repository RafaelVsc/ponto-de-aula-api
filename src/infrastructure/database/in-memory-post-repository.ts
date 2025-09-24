import { Post } from '../../domain/entities/Post';
import { FindPostsParams } from '../../domain/repositories/posts/find-posts-params';
import { PostRepository } from '../../domain/repositories/posts/post-repository';
import { randomUUID } from 'crypto';

export class InMemoryPostRepository implements PostRepository {
  private posts: Post[] = [];

  async findById(id: string): Promise<Post | null> {
    const post = this.posts.find(post => post.id === id);
    return post || null;
  }

  async findAll(params?: FindPostsParams): Promise<Post[]> {
    if (!params) {
      return [...this.posts];
    }

    let filteredPosts = [...this.posts];

    // Filtrar por termos de busca
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower),
      );
    }

    // Filtrar por tag
    if (params.tag) {
      filteredPosts = filteredPosts.filter(post => post.tags?.includes(params.tag!));
    }

    // Filtrar por autor
    if (params.authorId) {
      filteredPosts = filteredPosts.filter(post => post.authorId === params.authorId);
    }

    // Ordenar resultados
    if (params.sortBy) {
      filteredPosts.sort((a, b) => {
        if (params.sortBy === 'title') {
          return params.sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        } else if (params.sortBy === 'createdAt') {
          const dateA = a.createdAt || new Date();
          const dateB = b.createdAt || new Date();
          return params.sortOrder === 'desc'
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
    }

    // Implementar paginação
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
      title: data.title ?? current.title,
      content: data.content ?? current.content,
      authorId: data.authorId ?? current.authorId,
      updatedAt: now,
    };

    this.posts[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index !== -1) {
      this.posts.splice(index, 1);
    }
  }

  async create(post: Post): Promise<Post> {
    const now = new Date();
    const newPost: Post = {
      ...post,
      id: String(randomUUID()),
      createdAt: now,
      updatedAt: now,
      tags: post.tags ?? [],
    };
    this.posts.push(newPost);
    return newPost;
  }
}
