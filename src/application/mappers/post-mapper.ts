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
    author: post.author ?? '',
    tags: post.tags ?? [],
    // Converter Date para ISO String (ou usar now() como fallback)
    createdAt: (post.createdAt as Date).toISOString(),
    updatedAt: (post.updatedAt as Date).toISOString(),
  };
}

/**
 * Mapeia uma lista de posts para DTOs
 */
export function postsToOutputDTO(posts: Post[]): PostOutputDTO[] {
  return posts.map(postToOutputDTO);
}
