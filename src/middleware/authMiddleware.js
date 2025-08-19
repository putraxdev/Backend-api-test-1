const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('../dto/errorResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json(new ErrorResponse('Authorization header missing', 'UNAUTHORIZED'));
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json(new ErrorResponse('Token missing', 'UNAUTHORIZED'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(new ErrorResponse('Token expired', 'TOKEN_EXPIRED'));
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(new ErrorResponse('Invalid token', 'INVALID_TOKEN'));
    }
    return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
  }
};

module.exports = authMiddleware;
