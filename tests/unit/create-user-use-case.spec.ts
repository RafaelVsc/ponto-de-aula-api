import { CreateUserUseCase } from '@/application/usecases/users/create-user-use-case';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { User, UserRole } from '@/domain/entities/User';
import { ChangePasswordUseCase } from '@/application/usecases/users/change-password-use-case';


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

    it('rejects when new password equals current', async () => {
        const repo = makeRepo();
        const usecase = new ChangePasswordUseCase(repo, hasher);

        await expect(usecase.execute('u1', {
            currentPassword: '12345678',
            newPassword: '12345678',
        })).rejects.toMatchObject({ message: 'New password must be different from current password' });
    });

    it('updates password with a new hash', async () => {
        const repo = makeRepo();
        const oldHash = await hasher.hash('oldpass123');
        const user: User = {
            id: 'u2',
            name: 'User 2',
            email: 'u2@example.com',
            username: 'user2025',
            password: oldHash,
            role: UserRole.TEACHER,
        };
        repo.findById.mockResolvedValue(user);

        let updatedData: Partial<User> | undefined;
        repo.update.mockImplementation(async (_id, data) => {
            updatedData = data;
            return { ...user, ...data } as User;
        });

        const usecase = new ChangePasswordUseCase(repo, hasher);
        const result = await usecase.execute('u2', {
            currentPassword: 'oldpass123',
            newPassword: 'newpass123',
        });

        expect(result.success).toBe(true);
        expect(updatedData?.password).toBeDefined();
        expect(updatedData?.password).not.toBe('newpass123');
    });

});