import { GetPostByIdUseCase } from '@/application/usecases/posts/get-posts-by-id-use-case';
import { Post } from '@/domain/entities/Post';
import { PostRepository } from '@/domain/repositories/posts/post-repository';

describe('GetPostByIdUseCase', () => {
  const makeRepo = (): jest.Mocked<PostRepository> => ({
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  it('returns DTO when post exists', async () => {
    const repo = makeRepo();
    const post: Post = {
      id: 'p1',
      title: 'T',
      content: 'C',
      authorId: 'a1',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['t1'],
    };
    repo.findById.mockResolvedValue(post);

    const sut = new GetPostByIdUseCase(repo);
    const out = await sut.execute('p1');
    expect(out.id).toBe('p1');
    expect(typeof out.createdAt).toBe('string');
    expect(typeof out.updatedAt).toBe('string');
  });

  it('returns 404 when not found', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const sut = new GetPostByIdUseCase(repo);
    await expect(sut.execute('missing')).rejects.toMatchObject({ message: 'Post not found', statusCode: 404 });
  });
});

