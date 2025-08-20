const express = require('express');
const sequelize = require('../../src/models/db');
const userRoutes = require('../../src/routes/userRoutes');
const productRoutes = require('../../src/routes/productRoutes');
const { ErrorResponse } = require('../../src/dto/errorResponse');
const { specs, swaggerUi } = require('../../src/config/swagger');

// Import models to ensure they are registered - ORDER MATTERS!
const User = require('../../src/models/user');
const Product = require('../../src/models/product');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Advanced Backend API Documentation',
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

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
async function startServer() {
  try {
    // Sync models in the correct order - User first, then Product
    await User.sync();
    await Product.sync();

    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log('');
      console.log('✅ Available Endpoints:');
      console.log('📍 User Management:');
      console.log('   • POST /api/users/register - Register new user');
      console.log('   • POST /api/users/login - Login user');
      console.log('   • GET  /api/users/profile - Get user profile');
      console.log('📍 Product Management:');
      console.log('   • GET  /api/products - Get all products (with filters)');
      console.log('   • POST /api/products - Create new product');
      console.log('   • GET  /api/products/:id - Get product by ID');
      console.log('   • PUT  /api/products/:id - Update product');
      console.log('   • DELETE /api/products/:id - Delete product');
      console.log('   • GET  /api/products/sku/:sku - Get product by SKU');
      console.log('   • GET  /api/products/category/:category - Get products by category');
      console.log('   • GET  /api/products/reports/low-stock - Get low stock products');
    });
  } catch (err) {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  }
}

startServer();
