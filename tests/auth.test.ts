import request from 'supertest';
import express from 'express';
import router from '../server/routes';
import * as db from './db';

const app = express();
app.use(express.json());
app.use(router);

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/v0/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/v0/api/auth/register')
      .send({
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/v0/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(409);
  });

  it('should login a registered user', async () => {
    await request(app)
      .post('/v0/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/v0/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    await request(app)
      .post('/v0/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/v0/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
  });
});
