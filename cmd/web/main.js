const express = require('express');
const sequelize = require('../../src/models/db');
const userRoutes = require('../../src/routes/userRoutes');
const { ErrorResponse } = require('../../src/dto/errorResponse');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json(new ErrorResponse('Route not found', 'NOT_FOUND'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
  next();
});

const PORT = process.env.PORT || 3000;

// Database connection and server start
sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}).catch((err) => {
  console.error('Unable to connect to database:', err);
  process.exit(1);
});
