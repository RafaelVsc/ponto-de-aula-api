import request from 'supertest';
import { buildApp } from '@/main/app';

describe('Health (integration)', () => {
    it('GET /health return 200 and body', async () => {
        const app = buildApp();
        const res = await request(app).get('/health').expect(200);
        expect(res.body).toEqual({ status: 'ok' });
    })
})