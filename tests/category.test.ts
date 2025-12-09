import request from 'supertest';
import express from 'express';
import router from '../server/routes';
import * as db from './db';

const app = express();
app.use(express.json());
app.use(router);

let token: string;

beforeAll(async () => {
  await db.connect();
  // Register and login a user to get a token for authenticated requests
  await request(app)
    .post('/v0/api/auth/register')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

  const loginRes = await request(app)
    .post('/v0/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123',
    });
  token = loginRes.body.data.token;
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe('Category API', () => {
  it('should not allow access without a token', async () => {
    const res = await request(app).get('/v0/api/category');
    expect(res.statusCode).toEqual(401);
  });

  it('should create a new root category', async () => {
    const res = await request(app)
      .post('/v0/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Root' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('name', 'Root');
  });

  it('should fetch the category tree', async () => {
    await request(app)
      .post('/v0/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Root' });

    const res = await request(app)
      .get('/v0/api/category')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should update a category', async () => {
    const createRes = await request(app)
      .post('/v0/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Old Name' });

    const categoryId = createRes.body.data._id;

    const updateRes = await request(app)
      .put(`/v0/api/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.data).toHaveProperty('name', 'New Name');
  });

  it('should delete a category', async () => {
    const createRes = await request(app)
      .post('/v0/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'To Be Deleted' });

    const categoryId = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/v0/api/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toEqual(200);
  });

  it('should return an error if creating a category with no name', async () => {
    const res = await request(app)
      .post('/v0/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // Sending empty body
    expect(res.statusCode).toEqual(400);
  });

  it('should return an error when updating a non-existent category', async () => {
    const nonExistentId = '60d5ecb5b39e3b1e3c8b4567'; // Example of a valid but non-existent ObjectId
    const res = await request(app)
      .put(`/v0/api/category/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Does not matter' });
    expect(res.statusCode).toEqual(404);
  });

  it('should return an error when deleting a non-existent category', async () => {
    const nonExistentId = '60d5ecb5b39e3b1e3c8b4567';
    const res = await request(app)
      .delete(`/v0/api/category/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
  });
});
