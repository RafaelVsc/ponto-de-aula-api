import { UpdatePostUseCase } from '@/application/usecases/posts/update-post-use-case';
import { PostRepository } from '@/domain/repositories/posts/post-repository';
import { Post } from '@/domain/entities/Post';

// Este arquivo cobre os principais cenários do UpdatePostUseCase.
// Notas importantes:
// - Usamos um PostRepository mockado (jest.fn()) para simular I/O.
// - O mapper postToOutputDTO converte Date -> string (ISO). Por isso, nos mocks
//   incluímos createdAt/updatedAt como Date para não quebrar no toISOString().
// - "Sucesso" aqui significa a Promise resolver com o DTO (no nível HTTP seria 200).

describe('UpdatePostUseCase', () => {
  const makeRepo = (): jest.Mocked<PostRepository> => ({
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  it('updates when user is the author', async () => {
    const repo = makeRepo();
    // Arrange: post existente pertencente ao mesmo autor
    const base: Post = {
      id: 'p1',
      title: 'Old',
      content: 'Content here',
      authorId: 'author-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    // findById encontra o post; update retorna o post atualizado
    repo.findById.mockResolvedValue(base);
    repo.update.mockResolvedValue({ ...base, title: 'New', updatedAt: new Date() });

    const sut = new UpdatePostUseCase(repo);
    // Act: autor correto atualiza o título
    const out = await sut.execute('p1', { title: 'New' }, 'author-1');

    // Assert: título atualizado e datas convertidas para string pelo mapper
    expect(out.id).toBe('p1');
    expect(out.title).toBe('New');
    expect(typeof out.createdAt).toBe('string'); // mapper converte Date -> ISO
    expect(typeof out.updatedAt).toBe('string');
    expect(repo.findById).toHaveBeenCalledWith('p1');
    expect(repo.update).toHaveBeenCalledWith('p1', { title: 'New' });
  });

  it('rejects with 403 when non-author tries to update', async () => {
    const repo = makeRepo();
    // Arrange: post pertence a 'author-1'
    const base: Post = {
      id: 'p1',
      title: 't',
      content: 'c',
      authorId: 'author-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    repo.findById.mockResolvedValue(base);

    const usecase = new UpdatePostUseCase(repo);
    // Act+Assert: userId diferente do autor -> 403 (não deveria nem chamar update)
    await expect(usecase.execute('p1', { title: 'new' }, 'other-user')).rejects.toMatchObject({
      message: 'Forbidden: only author can update this post',
      statusCode: 403,
    });
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('returns 404 when update returns null', async () => {
    const repo = makeRepo();
    // Arrange: post existe, mas o repositório falha ao atualizar (retorna null)
    const base: Post = {
      id: 'p2',
      title: 'T',
      content: 'C',
      authorId: 'author-2',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    repo.findById.mockResolvedValue(base);
    repo.update.mockResolvedValue(null);

    const sut = new UpdatePostUseCase(repo);
    // Act+Assert: como update retornou null, o use case trata como 404
    await expect(sut.execute('p2', { title: 'New' }, 'author-2')).rejects.toMatchObject({
      message: 'Post not found',
      statusCode: 404,
    });
  });
});
