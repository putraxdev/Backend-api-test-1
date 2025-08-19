const { UserResponse } = require('./userResponse');

class LoginResponse {
  constructor(token, user) {
    this.token = token;
    this.user = new UserResponse(user);
    this.expiresIn = '1h';
  }
}

module.exports = {
  LoginResponse,
};
