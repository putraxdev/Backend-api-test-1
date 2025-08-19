const { Pool } = require('pg');

const pool = new Pool({
  user: 'appuser',
  host: 'localhost',
  database: 'appdb',
  password: 'appsecret',
  port: 5432,
});

module.exports = pool;
