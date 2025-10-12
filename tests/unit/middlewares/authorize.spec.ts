import { authorize } from '@/interfaces/http/middlewares/authorize';
import { UserRole } from '@/domain/entities/User';

// Testes do middleware `authorize`.
// Este middleware:
// - Lê `res.locals.auth` (id, role) – deve existir (senão lança 401)
// - Verifica se a role do usuário está nas `allowed` OU se é ADMIN (bypass)
// - Em caso de não autorizado, lança `AppError('Forbidden', 403)`
// Observação: este middleware lança erros (throw) diretamente, então os testes
// validam via try/catch em vez de `next(err)`.

const makeRes = (auth?: { id: string; role: UserRole }) => ({ locals: { auth } }) as any;
const makeNext = () => jest.fn();

describe('authorize middleware', () => {
  it('throws 401 when auth context is missing', () => {
    // Arrange: sem `res.locals.auth`
    expect.assertions(2);
    const mw = authorize(UserRole.TEACHER);
    const next = makeNext();
    try {
      mw({} as any, makeRes(undefined), next);
    } catch (err: any) {
      // Assert: lança AppError 401 e não chama next()
      expect(err).toMatchObject({ message: 'Authentication required', statusCode: 401 });
      expect(next).not.toHaveBeenCalled();
    }
  });

  it('throws 403 when role not allowed (and not admin)', () => {
    // Arrange: role STUDENT não está na lista permitida (TEACHER)
    expect.assertions(2);
    const mw = authorize(UserRole.TEACHER);
    const next = makeNext();
    try {
      mw({} as any, makeRes({ id: 'u1', role: UserRole.STUDENT }), next);
    } catch (err: any) {
      // Assert: lança 403 e não chama next()
      expect(err).toMatchObject({ message: 'Forbidden', statusCode: 403 });
      expect(next).not.toHaveBeenCalled();
    }
  });

  it('passes for allowed role', () => {
    // Arrange/Act: role permitida (TEACHER)
    const mw = authorize(UserRole.TEACHER);
    const next = makeNext();
    mw({} as any, makeRes({ id: 'u1', role: UserRole.TEACHER }), next);
    // Assert: segue fluxo
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('passes for ADMIN even if not explicitly allowed', () => {
    // Arrange/Act: ADMIN tem bypass
    const mw = authorize(UserRole.TEACHER);
    const next = makeNext();
    mw({} as any, makeRes({ id: 'u1', role: UserRole.ADMIN }), next);
    // Assert: segue fluxo
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
