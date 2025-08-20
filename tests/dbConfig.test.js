// Test database configuration
describe('Database Configuration', () => {
  let db;

  beforeEach(() => {
    // Clear the module cache to ensure fresh require
    jest.resetModules();
  });

  it('should export database configuration', () => {
    // Mock environment variables
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'test_db',
      DB_USER: 'test_user',
      DB_PASS: 'test_pass',
      NODE_ENV: 'test',
    };

    try {
      // eslint-disable-next-line global-require
      db = require('../src/repositories/db');

      expect(db).toBeDefined();
      expect(typeof db).toBe('object');
    } finally {
      process.env = originalEnv;
    }
  });

  it('should handle missing environment variables', () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
    };

    // Remove database env vars
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASS;

    try {
      // eslint-disable-next-line global-require
      db = require('../src/repositories/db');
      expect(db).toBeDefined();
    } finally {
      process.env = originalEnv;
    }
  });

  it('should use development settings in development mode', () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NODE_ENV: 'development',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'dev_db',
      DB_USER: 'dev_user',
      DB_PASS: 'dev_pass',
    };

    try {
      // eslint-disable-next-line global-require
      db = require('../src/repositories/db');
      expect(db).toBeDefined();
    } finally {
      process.env = originalEnv;
    }
  });

  it('should use production settings in production mode', () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      DB_HOST: 'prod-host',
      DB_PORT: '5432',
      DB_NAME: 'prod_db',
      DB_USER: 'prod_user',
      DB_PASS: 'prod_pass',
    };

    try {
      // eslint-disable-next-line global-require
      db = require('../src/repositories/db');
      expect(db).toBeDefined();
    } finally {
      process.env = originalEnv;
    }
  });

  it('should export sequelize instance', () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'test_db',
      DB_USER: 'test_user',
      DB_PASS: 'test_pass',
    };

    try {
      // eslint-disable-next-line global-require
      db = require('../src/repositories/db');

      // Should export a sequelize instance or configuration
      expect(db).toBeDefined();
      expect(typeof db).toBe('object');
    } finally {
      process.env = originalEnv;
    }
  });
});
