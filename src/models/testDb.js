const { Sequelize } = require('sequelize');

// Use in-memory SQLite for testing
const sequelize = new Sequelize('sqlite::memory:', {
  dialect: 'sqlite',
  logging: false,
});

module.exports = sequelize;
