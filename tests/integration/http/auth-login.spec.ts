import { UserRole } from '@/domain/entities/User';
import { JwtService } from '@/infrastructure/security/jwt-service';
import { buildApp } from '@/main/app';
import request from 'supertest';

describe('POST /auth/login (integration)', () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(async () => {
    app = buildApp();
    // Se o seed assíncrono causar flakiness, considere descomentar:
    await new Promise(r => setTimeout(r, 150));
  });

  it('returns 200 and a valid token when logging in with email and password', async () => {
    await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: '12345678' })
      .expect(200)
      .expect(res => {
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('Login'); // ou padronizar para 'Login successful'
        const token: string = res.body.data.token;
        expect(typeof token).toBe('string');

        const jwt = new JwtService();
        const payload = jwt.verify(token);
        expect(Object.values(UserRole)).toContain(payload.role);
        expect(payload.role).toBe(UserRole.ADMIN);
        expect(typeof payload.sub).toBe('string');
      });
  });
});
