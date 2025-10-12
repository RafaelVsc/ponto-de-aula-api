import { DeletePostUseCase } from '@/application/usecases/posts/delete-post-use-case';
import { Post } from '@/domain/entities/Post';
import { PostRepository } from '@/domain/repositories/posts/post-repository';
import { UserRole } from '@/domain/entities/User';

describe('DeletePostUseCase', () => {
  const makeRepo = (): jest.Mocked<PostRepository> => ({
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const makePost = (overrides?: Partial<Post>): Post => ({
    id: 'p1',
    title: 'T',
    content: 'C',
    authorId: 'author-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    ...overrides,
  });

  it('returns 404 when post does not exist', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const sut = new DeletePostUseCase(repo);
    await expect(sut.execute('missing', 'u1', UserRole.TEACHER)).rejects.toMatchObject({
      message: 'Post not found',
      statusCode: 404,
    });
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('returns 403 when user is not author nor admin', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(makePost());

    const sut = new DeletePostUseCase(repo);
    await expect(sut.execute('p1', 'other-user', UserRole.TEACHER)).rejects.toMatchObject({
      message: 'Forbidden: only the author or admin can delete this post',
      statusCode: 403,
    });
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('deletes when user is the author', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(makePost());

    const sut = new DeletePostUseCase(repo);
    await expect(sut.execute('p1', 'author-1', UserRole.TEACHER)).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('p1');
  });

  it('deletes when user is ADMIN', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(makePost());

    const sut = new DeletePostUseCase(repo);
    await expect(sut.execute('p1', 'someone', UserRole.ADMIN)).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('p1');
  });
});
