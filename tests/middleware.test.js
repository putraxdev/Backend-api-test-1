const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middleware/authMiddleware');
const validateRequest = require('../src/middleware/validateRequest');
const { registerRequest } = require('../src/dto/userRequest');

describe('Middleware Tests', () => {
  describe('authMiddleware', () => {
    let req; let res; let
      next;

    beforeEach(() => {
      req = { headers: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    test('should return 401 if no authorization header', () => {
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Authorization header missing',
        }),
      }));
    });

    test('should return 401 if no token in header', () => {
      req.headers.authorization = 'Bearer';
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalidtoken';
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('should return 401 if token is expired', () => {
      // Create an expired token
      const payload = { id: 1 };
      const expiredTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const expiredToken = jwt.sign({ ...payload, exp: expiredTime }, 'supersecretkey', {
        issuer: 'backend-api',
        audience: 'frontend-app',
      });
      req.headers.authorization = `Bearer ${expiredToken}`;
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('should return 500 for other JWT errors', () => {
      // Mock jwt.verify to throw a different error
      const originalVerify = jwt.verify;
      jwt.verify = jest.fn(() => {
        const error = new Error('Custom error');
        error.name = 'UnknownJWTError';
        throw error;
      });

      req.headers.authorization = 'Bearer sometoken';
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);

      // Restore original function
      jwt.verify = originalVerify;
    });

    test('should call next if token is valid', () => {
      const token = jwt.sign({ id: 1, username: 'test' }, 'supersecretkey', {
        expiresIn: '1h',
        issuer: 'backend-api',
        audience: 'frontend-app',
      });
      req.headers.authorization = `Bearer ${token}`;
      authMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });
  });

  describe('validateRequest', () => {
    let req; let res; let
      next;

    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    test('should return 400 for invalid request', () => {
      req.body = { username: 'ab', password: '123' }; // Invalid data
      const middleware = validateRequest(registerRequest);
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should call next for valid request', () => {
      req.body = { username: 'validuser', password: 'Valid123' };
      const middleware = validateRequest(registerRequest);
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
