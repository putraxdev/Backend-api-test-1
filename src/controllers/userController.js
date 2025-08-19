const userUsecase = require('../usecases/userUsecase');
const { ErrorResponse } = require('../dto/errorResponse');

class UserController {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userUsecase.register(username, password);
      res.status(201).json(user);
    } catch (err) {
      const statusCode = err.message === 'Username already exists' ? 409 : 400;
      res.status(statusCode).json(new ErrorResponse(err.message));
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await userUsecase.login(username, password);
      res.json(result);
    } catch (err) {
      const statusCode = err.message === 'Invalid username or password' ? 401 : 400;
      res.status(statusCode).json(new ErrorResponse(err.message));
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await userUsecase.getUserProfile(userId);
      res.json(user);
    } catch (err) {
      const statusCode = err.message === 'User not found' ? 404 : 400;
      res.status(statusCode).json(new ErrorResponse(err.message));
    }
  }
}

module.exports = new UserController();
