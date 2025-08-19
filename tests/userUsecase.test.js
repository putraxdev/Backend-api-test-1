const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userUsecase = require('../src/usecases/userUsecase');
const userRepository = require('../src/repositories/userRepository');

// Mock the repository
jest.mock('../src/repositories/userRepository');

describe('UserUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register user successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', created_at: new Date() };
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue(mockUser);

      const result = await userUsecase.register('testuser', 'Test123');

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('username', 'testuser');
      expect(userRepository.createUser).toHaveBeenCalledWith('testuser', expect.any(String));
    });

    test('should throw error if username exists', async () => {
      userRepository.findByUsername.mockResolvedValue({ id: 1 });

      await expect(userUsecase.register('testuser', 'Test123'))
        .rejects.toThrow('Username already exists');
    });
  });

  describe('login', () => {
    test('should login successfully with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('Test123', 12);
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: hashedPassword,
        created_at: new Date(),
      };
      userRepository.findByUsername.mockResolvedValue(mockUser);

      const result = await userUsecase.login('testuser', 'Test123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('testuser');
    });

    test('should throw error for invalid username', async () => {
      userRepository.findByUsername.mockResolvedValue(null);

      await expect(userUsecase.login('invalid', 'Test123'))
        .rejects.toThrow('Invalid username or password');
    });

    test('should throw error for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('Test123', 12);
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: hashedPassword,
      };
      userRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(userUsecase.login('testuser', 'wrongpassword'))
        .rejects.toThrow('Invalid username or password');
    });
  });

  describe('verifyToken', () => {
    test('should verify valid token', () => {
      const payload = { id: 1, username: 'test' };
      const token = jwt.sign(payload, 'supersecretkey', {
        issuer: 'backend-api',
        audience: 'frontend-app',
      });

      const result = userUsecase.verifyToken(token);
      expect(result.id).toBe(1);
      expect(result.username).toBe('test');
    });

    test('should throw error for expired token', async () => {
      // Create a token that expires in 1 millisecond
      const expiredToken = jwt.sign({ id: 1 }, 'supersecretkey', {
        expiresIn: '1ms',
        issuer: 'backend-api',
        audience: 'frontend-app',
      });

      // Wait a bit to ensure it expires
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      expect(() => userUsecase.verifyToken(expiredToken))
        .toThrow('Token expired');
    });

    test('should throw error for invalid token', () => {
      expect(() => userUsecase.verifyToken('invalidtoken'))
        .toThrow('Invalid token');
    });

    test('should throw error for token verification failure', () => {
      const wrongSecretToken = jwt.sign({ id: 1 }, 'wrongsecret');
      expect(() => userUsecase.verifyToken(wrongSecretToken))
        .toThrow('Invalid token');
    });
  });

  describe('getUserProfile', () => {
    test('should get user profile successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', created_at: new Date() };
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userUsecase.getUserProfile(1);
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('username', 'testuser');
    });

    test('should throw error if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(userUsecase.getUserProfile(1))
        .rejects.toThrow('User not found');
    });
  });
});
