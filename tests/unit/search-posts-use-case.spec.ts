import { SearchPostsUseCase } from '@/application/usecases/posts/search-posts-use-case';
import { Post } from '@/domain/entities/Post';
import { PostRepository } from '@/domain/repositories/posts/post-repository';

describe('SearchPostsUseCase', () => {
  const makeRepo = (): jest.Mocked<PostRepository> => ({
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  it('rejects invalid authorId type (400)', async () => {
    const repo = makeRepo();
    const sut = new SearchPostsUseCase(repo);
    await expect(sut.execute({ search: 'x', authorId: 123 as any })).rejects.toMatchObject({
      message: 'Invalid authorId',
      statusCode: 400,
    });
  });

  it('forwards filters and maps DTOs', async () => {
    const repo = makeRepo();
    const now = new Date();
    repo.findAll.mockResolvedValue([
      {
        id: 'p1',
        title: 'T',
        content: 'C',
        authorId: 'a1',
        createdAt: now,
        updatedAt: now,
        tags: ['t'],
      } as Post,
    ]);

    const sut = new SearchPostsUseCase(repo);
    const params = {
      search: 'abc',
      tag: 't',
      authorId: 'a1',
      page: 2,
      limit: 10,
      sortBy: 'title' as const,
      sortOrder: 'asc' as const,
    };
    const out = await sut.execute(params);

    expect(repo.findAll).toHaveBeenCalledWith(params);
    expect(out).toHaveLength(1);
    const first = out[0]!;
    expect(first.id).toBe('p1');
    expect(typeof first.createdAt).toBe('string');
  });
});
