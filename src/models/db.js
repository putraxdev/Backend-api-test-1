const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'appdb',
  process.env.DB_USER || 'appuser',
  process.env.DB_PASS || 'appsecret',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
);

module.exports = sequelize;
