const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { UserResponse } = require('../dto/userResponse');
const { LoginResponse } = require('../dto/loginResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const SALT_ROUNDS = 12; // Increase salt rounds for better security

class UserUsecase {
  async register(username, password) {
    // Check if user already exists
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password with stronger salt rounds
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await userRepository.createUser(username, hashedPassword);

    // Return user response without password
    return new UserResponse(user);
  }

  async login(username, password) {
    // Find user by username
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token with more claims
    const payload = {
      id: user.id,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h',
      issuer: 'backend-api',
      audience: 'frontend-app',
    });

    return new LoginResponse(token, user);
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'backend-api',
        audience: 'frontend-app',
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return new UserResponse(user);
  }
}

module.exports = new UserUsecase();
