import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { UserRole } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/app-error';

describe('authenticate middleware', () => {
  const makeRes = () => ({ locals: {} }) as any;
  const makeNext = () => jest.fn();

  it('calls next with 401 when header missing', () => {
    const tokenService = { verify: jest.fn() } as any;
    const mw = authenticate(tokenService);
    const req = { headers: {} } as any;
    const res = makeRes();
    const next = makeNext();
    mw(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err).toMatchObject({ message: 'Authentication required', statusCode: 401 });
  });

  it('calls next with error when token invalid', () => {
    const tokenService = {
      verify: jest.fn(() => {
        throw new AppError('Invalid or expired token', 401);
      }),
    } as any;
    const mw = authenticate(tokenService);
    const req = { headers: { authorization: 'Bearer invalid' } } as any;
    const res = makeRes();
    const next = makeNext();
    mw(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toMatchObject({ message: 'Invalid or expired token', statusCode: 401 });
  });

  it('sets res.locals.auth and calls next on success', () => {
    const payload = { sub: 'u1', role: UserRole.TEACHER };
    const tokenService = { verify: jest.fn(() => payload) } as any;
    const mw = authenticate(tokenService);
    const req = { headers: { authorization: 'Bearer token' } } as any;
    const res = makeRes();
    const next = makeNext();
    mw(req, res, next);
    expect(res.locals.auth).toEqual({ id: 'u1', role: UserRole.TEACHER });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
