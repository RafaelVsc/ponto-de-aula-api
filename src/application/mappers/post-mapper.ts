import { Post } from '@/domain/entities/Post';
import { PostOutputDTO } from '@/application/dto/PostDTO';

/**
 * Converte uma entidade Post para o DTO usado na API
 * @param post Entidade Post do domínio
 * @returns DTO formatado para API com valores garantidos
 */
export function postToOutputDTO(post: Post): PostOutputDTO {
  // Garantir valores não-nulos com fallbacks seguros
  return {
    id: post.id ?? '',
    title: post.title ?? '',
    content: post.content ?? '',
    authorId: post.authorId ?? '',
    tags: post.tags ?? [],
    // Converter Date para ISO String (ou usar now() como fallback)
    createdAt: post.createdAt ? (post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt) : new Date().toISOString(),
    updatedAt: post.updatedAt ? (post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt) : new Date().toISOString(),
  };
}

/**
 * Versão enriquecida do DTO com nome do autor
 */
export function postToDetailedDTO(post: Post, authorName?: string): PostOutputDTO {
  return {
    ...postToOutputDTO(post),
    authorName
  };
}

/**
 * Mapeia uma lista de posts para DTOs
 */
export function postsToOutputDTO(posts: Post[]): PostOutputDTO[] {
  return posts.map(postToOutputDTO);
}