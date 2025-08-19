const request = require('supertest');
const express = require('express');

// Mock the regular db with test db before requiring other modules
// eslint-disable-next-line global-require
jest.mock('../src/models/db', () => require('../src/models/testDb'));

const sequelize = require('../src/models/testDb');
const userRoutes = require('../src/routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database for testing
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'Test123',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', userData.username);
      expect(response.body).not.toHaveProperty('password');
    });

    test('should return 400 for invalid password', async () => {
      const userData = {
        username: 'testuser2',
        password: '123', // Too short
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toHaveProperty('message');
    });

    test('should return 409 for duplicate username', async () => {
      const userData = {
        username: 'testuser', // Already exists
        password: 'Test123',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(409);

      expect(response.body.error.message).toBe('Username already exists');
    });
  });

  describe('POST /api/users/login', () => {
    test('should login successfully with correct credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'Test123',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', loginData.username);
    });

    test('should return 401 for invalid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error.message).toBe('Invalid username or password');
    });
  });

  describe('GET /api/users/profile', () => {
    let authToken;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testuser',
          password: 'Test123',
        });
      authToken = loginResponse.body.token;
    });

    test('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).not.toHaveProperty('password');
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });
});
