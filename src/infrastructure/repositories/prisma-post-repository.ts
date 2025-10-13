import { Post } from '@/domain/entities/Post';
import { FindPostsParams } from '@/domain/repositories/posts/find-posts-params';
import { PostRepository } from '@/domain/repositories/posts/post-repository';
import { Prisma, PrismaClient } from '@/generated/prisma/client';
import {
  toDomain,
  toDomainWithAuthor,
  toPrismaCreate,
  toPrismaUpdate,
} from '../database/prisma/mappers/prisma-post-mapper';

export class PrismaPostRepository implements PostRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({ where: { id }, include: { author: true } });
    return post ? toDomainWithAuthor(post) : null;
  }

  async findAll(params?: FindPostsParams): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: buildWhere(params),
      include: { author: true },
      orderBy: buildOrderBy(params),
      ...buildPagination(params),
    });
    return posts.map(toDomainWithAuthor);
  }

  async create(post: Post): Promise<Post> {
    const created = await this.prisma.post.create({ data: toPrismaCreate(post) });
    return toDomain(created);
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    try {
      const updated = await this.prisma.post.update({
        where: { id },
        data: toPrismaUpdate(data),
      });
      return toDomain(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Prisma lança P2025 quando não encontra o registro
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}

// traduz search, tag, authorId etc... para PostWhereInput
const buildWhere = (params?: FindPostsParams): Prisma.PostWhereInput | undefined => {
  if (!params) return undefined;

  const where: Prisma.PostWhereInput = {};

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { content: { contains: params.search, mode: 'insensitive' } },
      { tags: { has: params.search } },
    ];
  }

  if (params.title) {
    where.title = { contains: params.title, mode: 'insensitive' };
  }

  if (params.tag) {
    where.tags = { has: params.tag };
  }

  if (params.authorId) {
    where.authorId = params.authorId;
  }

  if (params.authorName) {
    where.author = {
      name: { contains: params.authorName, mode: 'insensitive' },
    };
  }

  return Object.keys(where).length ? where : undefined;
};

const buildOrderBy = (
  params?: FindPostsParams,
): Prisma.PostOrderByWithRelationInput | undefined => {
  if (!params?.sortBy) return { createdAt: 'desc' }; // default opcional
  const direction: Prisma.SortOrder = params.sortOrder === 'desc' ? 'desc' : 'asc';
  return { [params.sortBy]: direction };
};

const buildPagination = (params?: FindPostsParams): { skip?: number; take?: number } => {
  if (params?.page !== undefined && params?.limit !== undefined) {
    const safePage = Math.max(params.page, 1);
    const take = Math.max(params.limit, 1);
    const skip = (safePage - 1) * take;
    return { skip, take };
  }
  return {};
};
