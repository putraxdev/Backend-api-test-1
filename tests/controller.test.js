const userController = require('../src/controllers/userController');
const userUsecase = require('../src/usecases/userUsecase');

jest.mock('../src/usecases/userUsecase');

describe('UserController', () => {
  let req; let
    res;

  beforeEach(() => {
    req = { body: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should handle registration error with 409 for existing username', async () => {
      req.body = { username: 'test', password: 'Test123' };
      userUsecase.register.mockRejectedValue(new Error('Username already exists'));

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Username already exists',
        }),
      }));
    });

    test('should handle other registration errors with 400', async () => {
      req.body = { username: 'test', password: 'Test123' };
      userUsecase.register.mockRejectedValue(new Error('Some other error'));

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    test('should handle invalid credentials with 401', async () => {
      req.body = { username: 'test', password: 'wrong' };
      userUsecase.login.mockRejectedValue(new Error('Invalid username or password'));

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('should handle other login errors with 400', async () => {
      req.body = { username: 'test', password: 'test' };
      userUsecase.login.mockRejectedValue(new Error('Some other error'));

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getProfile', () => {
    test('should handle user not found with 404', async () => {
      userUsecase.getUserProfile.mockRejectedValue(new Error('User not found'));

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('should handle other profile errors with 400', async () => {
      userUsecase.getUserProfile.mockRejectedValue(new Error('Some other error'));

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
