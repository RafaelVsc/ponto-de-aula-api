import { DeleteUserUseCase } from '@/application/usecases/users/delete-user-use-case';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { UserRole } from '@/domain/entities/User';

describe('DeleteUserUseCase (unit)', () => {
    const makeRepo = (): jest.Mocked<UserRepository> => ({
        findById: jest.fn(),
        findAll: jest.fn(),
        findByEmail: jest.fn(),
        findByUsername: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    });

    it('rejects 403 when non-admin', async () => {
        const repo = makeRepo();
        const sut = new DeleteUserUseCase(repo);
        await expect(sut.execute('u1', UserRole.TEACHER))
            .rejects.toMatchObject({ message: 'Only ADMIN can delete users', statusCode: 403 });
        expect(repo.findById).not.toHaveBeenCalled();
        expect(repo.delete).not.toHaveBeenCalled();
    });

    it('rejects 404 when admin and user not found', async () => {
        const repo = makeRepo();
        repo.findById.mockResolvedValue(null);
        const sut = new DeleteUserUseCase(repo);
        await expect(sut.execute('missing', UserRole.ADMIN))
            .rejects.toMatchObject({ message: 'User not found', statusCode: 404 });
        expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deletes when admin and user exists', async () => {
        const repo = makeRepo();
        repo.findById.mockResolvedValue({ id: 'u1' } as any);
        const sut = new DeleteUserUseCase(repo);
        await expect(sut.execute('u1', UserRole.ADMIN)).resolves.toBeUndefined();
        expect(repo.delete).toHaveBeenCalledWith('u1');
    });
});
