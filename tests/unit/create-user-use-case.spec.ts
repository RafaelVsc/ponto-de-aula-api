import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';


describe('CreateUserUseCase (unit)', () => {
    let hasher: BcryptHasher;

    const makeRepo = (): jest.Mocked<UserRepository> => ({
        findByEmail: jest.fn(),
        findByUsername: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    });

    beforeEach(() => {
        hasher = new BcryptHasher(4);
        jest.clearAllMocks();
    });

    it('creates a STUDENT and hashes password', async () => {
        const repo = makeRepo();
        repo.findByEmail.mockResolvedValue(null);
        repo.findByUsername.mockResolvedValue(null);

        let capturedUser: User | undefined;
        repo.create.mockImplementation(async (u) => {
            capturedUser = u;
            return { ...u, id: 'u1' };
        });

        const usecase = new CreateUserUseCase(repo, hasher);
        const result = await usecase.execute({
            name: 'Student 1',
            email: 's1@example.com',
            username: 'student2025',
            password: '12345678',
            role: UserRole.STUDENT,
        }, UserRole.ADMIN);

        expect(result.id).toBe('u1');
        expect(result.email).toBe('s1@example.com');
        expect(capturedUser?.password).not.toBe('12345678');
    });

    it('rejects with 400 when role is invalid', async () => {
        const repo = makeRepo();
        repo.findByEmail.mockResolvedValue(null);

        const sut = new CreateUserUseCase(repo, hasher);
        await expect(sut.execute({
            name: 'X',
            email: 'x@example.com',
            username: 'user2025',
            password: '12345678',
            role: 'INVALID' as any,
        }, UserRole.ADMIN)).rejects.toMatchObject({
            message: 'Invalid role',
            statusCode: 400,
        });
    });

});