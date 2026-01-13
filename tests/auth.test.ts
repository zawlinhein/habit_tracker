import request from 'supertest';
import app from '../src/server.ts';
import { cleanupDB, createTestUser } from './setup/dbHelper.ts';
import type { email } from 'zod';

describe('Auth endpoint', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'zawg',
        password: 'password',
        email: 'zg@gmail.com',
      };
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      expect(res.body).toHaveProperty('username');
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login', async () => {
      const newUser = await createTestUser();
      const res = await request(app)
        .post('/api/auth/signIn')
        .send({
          email: newUser.user.email,
          password: newUser.plainPassword,
        })
        .expect(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Successfully login in!');
    });
  });
});
