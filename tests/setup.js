// Jest setup file to ensure consistent test environment

// Set test environment variables
process.env.JWT_SECRET = 'supersecretkey';
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'appdb';
process.env.DB_USER = 'appuser';
process.env.DB_PASS = 'appsecret';

// Global test setup can go here
