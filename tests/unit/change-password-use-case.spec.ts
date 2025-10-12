import { ChangePasswordUseCase } from '@/application/usecases/users/change-password-use-case';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { User, UserRole } from '@/domain/entities/User';

describe('ChangePasswordUseCase', () => {
  const makeRepo = (): jest.Mocked<UserRepository> => ({
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  let hasher: BcryptHasher;
  beforeEach(() => {
    hasher = new BcryptHasher(4);
    jest.clearAllMocks();
  });

  it('rejects when new password equals current', async () => {
    const repo = makeRepo();
    const usecase = new ChangePasswordUseCase(repo, hasher);

    await expect(
      usecase.execute('u1', {
        currentPassword: '12345678',
        newPassword: '12345678',
      }),
    ).rejects.toMatchObject({
      message: 'New password must be different from current password',
    });

    expect(repo.findById).not.toHaveBeenCalled();
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('rejects when current password is invalid', async () => {
    const repo = makeRepo();
    const usecase = new ChangePasswordUseCase(repo, hasher);
    const hash = await hasher.hash('correct-123');
    repo.findById.mockResolvedValue({
      id: 'u1',
      name: 'U',
      email: 'u@example.com',
      username: 'user2025',
      password: hash,
      role: UserRole.TEACHER,
    } as User);

    await expect(
      usecase.execute('u1', {
        currentPassword: 'wrong',
        newPassword: 'new-123456',
      }),
    ).rejects.toMatchObject({ message: 'Current password is invalid' });
  });

  it('updates password successfully', async () => {
    const repo = makeRepo();
    const usecase = new ChangePasswordUseCase(repo, hasher);
    const oldHash = await hasher.hash('old-123456');
    const user: User = {
      id: 'u1',
      name: 'U',
      email: 'u@example.com',
      username: 'user2025',
      password: oldHash,
      role: UserRole.TEACHER,
    };
    repo.findById.mockResolvedValue(user);
    repo.update.mockImplementation(async (_id, data) => ({ ...user, ...data }) as User);

    await expect(
      usecase.execute('u1', {
        currentPassword: 'old-123456',
        newPassword: 'new-123456',
      }),
    ).resolves.toEqual({ success: true, message: 'Password updated successfully' });
  });
});
