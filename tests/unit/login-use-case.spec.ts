import { LoginUseCase } from '@/application/usecases/auth/login-use-case';
import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { AppError } from '@/shared/errors/app-error';
import { BcryptHasher } from '@/infrastructure/security/bcrypt-hasher';
import { JwtService } from '@/infrastructure/security/jwt-service';

// Este arquivo cobre os fluxos essenciais do LoginUseCase:
// - login por email e por username (sucesso)
// - senha inválida (falha)
// - validação de entrada: exigir email ou username
// - quando ambos são informados, prioriza email
// - usuário inexistente por username (falha)
describe('LoginUseCase (jest mocks)', () => {
  let hasher: BcryptHasher;
  let tokenService: JwtService;

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
    // BcryptHasher 4, apenas para reduzir custo do hash.
    hasher = new BcryptHasher(4);
    tokenService = new JwtService();
    jest.clearAllMocks();
  });

  it('logs in with email and returns a valid token', async () => {
    // Arrange: cria um usuário com senha hasheada e configura o mock por email
    const password = '12345678';
    const passwordHash = await hasher.hash(password);
    const user: User = {
      id: 'u1',
      name: 'Test User',
      email: 'user@example.com',
      username: 'user2025',
      password: passwordHash,
      role: UserRole.TEACHER,
    };

    const repo = makeRepo();
    repo.findByEmail.mockResolvedValue(user);

    // Act: executa login passando email
    const usecase = new LoginUseCase(repo, hasher, tokenService);
    const result = await usecase.execute({ email: 'user@example.com', password });

    // Assert: token válido, payload esperado e lookup por email
    expect(typeof result.token).toBe('string');
    const payload = tokenService.verify(result.token);
    expect(payload.sub).toBe('u1');
    expect(payload.role).toBe(UserRole.TEACHER);
    expect(repo.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(repo.findByUsername).not.toHaveBeenCalled();

  });

  it('logs in with username and returns a valid token', async () => {
    // Arrange: configura o mock para encontrar usuário por username
    const password = '12345678';
    const passwordHash = await hasher.hash(password);
    const user: User = {
      id: 'u3',
      name: 'User 3',
      email: 'user3@example.com',
      username: 'user2025',
      password: passwordHash,
      role: UserRole.ADMIN,
    };

    const repo = makeRepo();
    repo.findByUsername.mockResolvedValue(user);

    // Act: executa login passando username
    const usecase = new LoginUseCase(repo, hasher, tokenService);
    const result = await usecase.execute({ username: 'user2025', password });

    // Assert: token válido e lookup por username
    expect(typeof result.token).toBe('string');
    const payload = tokenService.verify(result.token);
    expect(payload.sub).toBe('u3');
    expect(payload.role).toBe(UserRole.ADMIN);
    expect(repo.findByUsername).toHaveBeenCalledWith('user2025');
    expect(repo.findByEmail).not.toHaveBeenCalled();

  });

  it('fails with invalid password', async () => {
    // Arrange: repositório retorna usuário, mas senha informada é incorreta
    const correctHash = await hasher.hash('correct-password');
    const user: User = {
      id: 'u2',
      name: 'Other User',
      email: 'other@example.com',
      username: 'other2025',
      password: correctHash,
      role: UserRole.STUDENT,
    };

    const repo = makeRepo();
    repo.findByEmail.mockResolvedValue(user);

    // Act+Assert: rejeita com AppError (credenciais inválidas)
    const usecase = new LoginUseCase(repo, hasher, tokenService);
    await expect(
      usecase.execute({ email: 'other@example.com', password: 'wrong' })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('requires email or username', async () => {
    // Assert: validação de entrada exige ao menos email ou username
    const repo = makeRepo();
    const usecase = new LoginUseCase(repo, hasher, tokenService);

    await expect(
      usecase.execute({
        email: undefined, username: undefined, password:
          '12345678'
      })
    ).rejects.toMatchObject({ message: 'Email or Username is required' });

  });

  it('prioritizes email when both email and username are provided', async () => {
    // Arrange: mesmo username para dois usuários; por regra, buscará por email primeiro
    const password = '12345678';
    const passwordHash = await hasher.hash(password);

    const userByEmail: User = {
      id: 'email-user',
      name: 'Email First',
      email: 'email@example.com',
      username: 'uname1',
      password: passwordHash,
      role: UserRole.SECRETARY,
    };
    const userByUsername: User = {
      id: 'username-user',
      name: 'Username Ignored',
      email: 'other@example.com',
      username: 'uname1',
      password: passwordHash,
      role: UserRole.ADMIN,
    };

    const repo = makeRepo();
    repo.findByEmail.mockResolvedValue(userByEmail);
    // Caso fosse chamado (não será), retornaria outro usuário
    repo.findByUsername.mockResolvedValue(userByUsername);

    const usecase = new LoginUseCase(repo, hasher, tokenService);
    const result = await usecase.execute({
      email: 'email@example.com',
      username: 'uname1',
      password,
    });

    // Assert: prioriza email e não chama findByUsername
    const payload = tokenService.verify(result.token);
    expect(payload.sub).toBe('email-user');
    expect(payload.role).toBe(UserRole.SECRETARY);
    expect(repo.findByEmail).toHaveBeenCalledTimes(1);
    expect(repo.findByUsername).not.toHaveBeenCalled();

  });

  it('fails when user not found by username', async () => {
    // Arrange: username inexistente
    const repo = makeRepo();
    repo.findByUsername.mockResolvedValue(null);

    // Assert: rejeita com AppError de credenciais inválidas
    const usecase = new LoginUseCase(repo, hasher, tokenService);
    await expect(
      usecase.execute({ username: 'missing', password: '12345678' })
    ).rejects.toMatchObject({ message: 'Invalid credentials' });

  });
});
