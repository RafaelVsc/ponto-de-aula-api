import { CreatePostUseCase } from '@/application/usecases/posts/create-post-use-case';
import { PostRepository } from '@/domain/repositories/posts/post-repository';
import { Post } from '@/domain/entities/Post';

describe('CreatePostUseCase', () => {
  const makeRepo = (): jest.Mocked<PostRepository> => ({
    findById: jest.fn(),
    findAll: jest.fn(),
    findAuthors: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  it('creates post and returns id', async () => {
    const repo = makeRepo();
    const usecase = new CreatePostUseCase(repo);

    const input = {
      title: 'Título',
      content: 'Conteúdo',
      authorId: 'author-1',
      videoUrl: 'http://video.example.com/v1',
      imageUrl: 'http://img.example.com/i1',
      tags: ['tag1', 'tag2'],
    };

    repo.create.mockImplementation(async (p: Post) => ({ ...p, id: 'post-1' }));

    const result = await usecase.execute(input);

    expect(result).toEqual({ id: 'post-1' });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Título',
        content: 'Conteúdo',
        authorId: 'author-1',
        videoUrl: 'http://video.example.com/v1',
        imageUrl: 'http://img.example.com/i1',
        tags: ['tag1', 'tag2'],
      }),
    );
  });
  it('creates post with minimal fields (no optional)', async () => {
    const repo = makeRepo();
    const usecase = new CreatePostUseCase(repo);

    const input = {
      title: 'Min',
      content: 'Sem opcionais',
      authorId: 'author-2',
    };

    // Simula o repositório preenchendo id e (opcionalmente) tags vazias
    repo.create.mockImplementation(async (p: Post) => ({
      ...p,
      id: 'post-2',
      tags: p.tags ?? [],
    }));

    const result = await usecase.execute(input);

    expect(result).toEqual({ id: 'post-2' });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Min',
        content: 'Sem opcionais',
        authorId: 'author-2',
      }),
    );
  });
});
