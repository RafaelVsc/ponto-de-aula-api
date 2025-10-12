import { Post } from '@/domain/entities/Post';
import { Prisma, Post as PrismaPost } from '@/generated/prisma/client';

type PrismaPostWithAuthor = Prisma.PostGetPayload<{ include: { author: true } }>;

const normalizeNullable = (value: string | null | undefined): string | undefined =>
  value == null ? undefined : value;

export const toDomain = (post: PrismaPost): Post => ({
  id: post.id,
  title: post.title,
  content: post.content,
  authorId: post.authorId,
  videoUrl: normalizeNullable(post.videoUrl),
  imageUrl: normalizeNullable(post.imageUrl),
  tags: post.tags ?? [],
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export const toDomainWithAuthor = (post: PrismaPostWithAuthor): Post => ({
  ...toDomain(post),
  author: post.author?.name,
});

export const toPrismaCreate = (post: Post): Prisma.PostUncheckedCreateInput => {
  const data: Prisma.PostUncheckedCreateInput = {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    videoUrl: normalizeNullable(post.videoUrl),
    imageUrl: normalizeNullable(post.imageUrl),
    tags: post.tags ?? [],
  };
  if (post.id) data.id = post.id;
  if (post.createdAt) data.createdAt = post.createdAt;
  if (post.updatedAt) data.updatedAt = post.updatedAt;

  return data;
};

export const toPrismaUpdate = (
  post: Partial<Pick<Post, 'title' | 'content' | 'videoUrl' | 'imageUrl' | 'tags'>>,
): Prisma.PostUncheckedUpdateInput => {
  const data: Prisma.PostUncheckedUpdateInput = {};

  if (post.title !== undefined) data.title = post.title;
  if (post.content !== undefined) data.content = post.content;
  if (post.videoUrl !== undefined) data.videoUrl = post.videoUrl ?? null;
  if (post.imageUrl !== undefined) data.imageUrl = post.imageUrl ?? null;
  if (post.tags !== undefined) data.tags = post.tags;

  return data;
};
