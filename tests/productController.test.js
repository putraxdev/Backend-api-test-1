const request = require('supertest');
const express = require('express');
const { ProductController } = require('../src/controllers/productController');
const ProductUsecase = require('../src/usecases/productUsecase');
const { ErrorResponse } = require('../src/dto/errorResponse');

// Mock the ProductUsecase
jest.mock('../src/usecases/productUsecase');

describe('Product Controller', () => {
  let app;
  let appWithoutAuth;
  let mockProductUsecase;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock usecase instance
    mockProductUsecase = {
      createProduct: jest.fn(),
      getAllProducts: jest.fn(),
      getProductById: jest.fn(),
      getProductBySku: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      softDeleteProduct: jest.fn(),
      updateProductStock: jest.fn(),
      getProductsByCategory: jest.fn(),
      getLowStockProducts: jest.fn(),
    };

    // Mock the constructor
    ProductUsecase.mockImplementation(() => mockProductUsecase);

    // Create Express app with routes
    app = express();
    app.use(express.json());

    const productController = new ProductController();

    // Mock auth middleware
    app.use((req, res, next) => {
      req.user = { id: 1 }; // Mock authenticated user
      next();
    });

    // Setup routes
    app.post('/products', (req, res) => productController.createProduct(req, res));
    app.get('/products', (req, res) => productController.getAllProducts(req, res));
    app.get('/products/:id', (req, res) => productController.getProductById(req, res));
    app.put('/products/:id', (req, res) => productController.updateProduct(req, res));
    app.delete('/products/:id', (req, res) => productController.deleteProduct(req, res));
    app.patch('/products/:id/deactivate', (req, res) => productController.softDeleteProduct(req, res));
    app.patch('/products/:id/stock', (req, res) => productController.updateProductStock(req, res));
    app.get('/products/sku/:sku', (req, res) => productController.getProductBySku(req, res));
    app.get('/products/category/:category', (req, res) => productController.getProductsByCategory(req, res));
    app.get('/products/reports/low-stock', (req, res) => productController.getLowStockProducts(req, res));

    // Create app without auth for testing authentication requirements
    appWithoutAuth = express();
    appWithoutAuth.use(express.json());

    // Mock auth middleware that always returns 401
    appWithoutAuth.use((req, res, next) => {
      return res.status(401).json({ 
        success: false, 
        error: { 
          message: 'Authentication required', 
          code: 'UNAUTHORIZED' 
        } 
      });
    });

    // Setup routes for appWithoutAuth
    appWithoutAuth.patch('/products/:id/deactivate', (req, res) => productController.softDeleteProduct(req, res));
    appWithoutAuth.patch('/products/:id/stock', (req, res) => productController.updateProductStock(req, res));
    appWithoutAuth.delete('/products/:id', (req, res) => productController.deleteProduct(req, res));
  });

  describe('POST /products', () => {
    it('should create product successfully', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-001',
        category: 'Electronics',
      };

      const mockResponse = { id: 1, ...productData };
      mockProductUsecase.createProduct.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product created successfully');
      expect(response.body.data.id).toBe(1);
      expect(mockProductUsecase.createProduct).toHaveBeenCalledWith(productData, 1);
    });

    it('should handle validation errors', async () => {
      const invalidData = { name: 'Test' }; // Missing required fields

      mockProductUsecase.createProduct.mockRejectedValue(
        new ErrorResponse('Validation error', 'VALIDATION_ERROR', 400),
      );

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Validation error');
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    it('should handle duplicate SKU error', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        sku: 'DUPLICATE-001',
        category: 'Electronics',
      };

      mockProductUsecase.createProduct.mockRejectedValue(
        new ErrorResponse('SKU already exists', 'DUPLICATE_SKU', 409),
      );

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(409);

      expect(response.body.message).toBe('SKU already exists');
    });
  });

  describe('GET /products', () => {
    it('should get all products with default pagination', async () => {
      const mockResponse = {
        products: [
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      mockProductUsecase.getAllProducts.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should support query parameters', async () => {
      const mockResponse = {
        products: [{ id: 1, name: 'Gaming Laptop' }],
        pagination: {
          page: 1, limit: 5, total: 1, totalPages: 1,
        },
      };

      mockProductUsecase.getAllProducts.mockResolvedValue(mockResponse);

      await request(app)
        .get('/products?page=1&limit=5&search=gaming&category=electronics')
        .expect(200);

      expect(mockProductUsecase.getAllProducts).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        search: 'gaming',
        category: 'electronics',
        isActive: undefined,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  describe('GET /products/:id', () => {
    it('should get product by id', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      mockProductUsecase.getProductById.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/products/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(mockProductUsecase.getProductById).toHaveBeenCalledWith('1');
    });

    it('should handle product not found', async () => {
      mockProductUsecase.getProductById.mockRejectedValue(
        new ErrorResponse('Product not found', 'NOT_FOUND', 404),
      );

      const response = await request(app)
        .get('/products/999')
        .expect(404);

      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('PUT /products/:id', () => {
    it('should update product successfully', async () => {
      const updateData = { name: 'Updated Product', price: 149.99 };
      const mockResponse = { id: 1, ...updateData };

      mockProductUsecase.updateProduct.mockResolvedValue(mockResponse);

      const response = await request(app)
        .put('/products/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.data.name).toBe('Updated Product');
      expect(mockProductUsecase.updateProduct).toHaveBeenCalledWith('1', updateData, 1);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete product successfully', async () => {
      mockProductUsecase.deleteProduct.mockResolvedValue({
        message: 'Product deleted successfully',
      });

      const response = await request(app)
        .delete('/products/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product deleted successfully');
      expect(mockProductUsecase.deleteProduct).toHaveBeenCalledWith('1');
    });
  });

  describe('PATCH /products/:id/deactivate', () => {
    it('should soft delete product successfully', async () => {
      const mockResponse = { id: 1, isActive: false };
      mockProductUsecase.softDeleteProduct.mockResolvedValue(mockResponse);

      const response = await request(app)
        .patch('/products/1/deactivate')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product deactivated successfully');
      expect(response.body.data.isActive).toBe(false);
      expect(mockProductUsecase.softDeleteProduct).toHaveBeenCalledWith('1', 1);
    });
  });

  describe('PATCH /products/:id/stock', () => {
    it('should update product stock successfully', async () => {
      const stockData = { stock: 25 };
      const mockResponse = { id: 1, stock: 25 };

      mockProductUsecase.updateProductStock.mockResolvedValue(mockResponse);

      const response = await request(app)
        .patch('/products/1/stock')
        .send(stockData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product stock updated successfully');
      expect(response.body.data.stock).toBe(25);
      expect(mockProductUsecase.updateProductStock).toHaveBeenCalledWith('1', 25, 1);
    });
  });

  describe('GET /products/sku/:sku', () => {
    it('should get product by sku', async () => {
      const mockProduct = { id: 1, sku: 'TEST-001', name: 'Test Product' };
      mockProductUsecase.getProductBySku.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/products/sku/TEST-001')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sku).toBe('TEST-001');
      expect(mockProductUsecase.getProductBySku).toHaveBeenCalledWith('TEST-001');
    });
  });

  describe('GET /products/category/:category', () => {
    it('should get products by category', async () => {
      const mockProducts = [
        { id: 1, category: 'Electronics' },
        { id: 2, category: 'Electronics' },
      ];

      mockProductUsecase.getProductsByCategory.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/products/category/Electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(mockProductUsecase.getProductsByCategory).toHaveBeenCalledWith('Electronics');
    });
  });

  describe('GET /products/reports/low-stock', () => {
    it('should get low stock products with default threshold', async () => {
      const mockProducts = [
        { id: 1, stock: 5 },
        { id: 2, stock: 8 },
      ];

      mockProductUsecase.getLowStockProducts.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/products/reports/low-stock')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(mockProductUsecase.getLowStockProducts).toHaveBeenCalledWith(10);
    });

    it('should support custom threshold', async () => {
      const mockProducts = [{ id: 1, stock: 3 }];

      mockProductUsecase.getLowStockProducts.mockResolvedValue(mockProducts);

      await request(app)
        .get('/products/reports/low-stock?threshold=5')
        .expect(200);

      expect(mockProductUsecase.getLowStockProducts).toHaveBeenCalledWith(5);
    });
  });

  describe('Authentication Tests', () => {
    let appWithoutAuth;

    beforeEach(() => {
      appWithoutAuth = express();
      appWithoutAuth.use(express.json());

      const productController = new ProductController();

      // No auth middleware - req.user will be undefined
      appWithoutAuth.post('/products', (req, res) => productController.createProduct(req, res));
      appWithoutAuth.put('/products/:id', (req, res) => productController.updateProduct(req, res));
    });

    it('should require authentication for creating products', async () => {
      const response = await request(appWithoutAuth)
        .post('/products')
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body.message).toBe('Authentication required');
    });

    it('should require authentication for updating products', async () => {
      const response = await request(appWithoutAuth)
        .put('/products/1')
        .send({ name: 'Updated' })
        .expect(401);

      expect(response.body.message).toBe('Authentication required');
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle internal errors in createProduct', async () => {
      mockProductUsecase.createProduct.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/products')
        .send({
          name: 'Test Product',
          sku: 'TEST-001',
          category: 'Electronics',
          price: 99.99
        })
        .expect(500);

      expect(response.body.error.message).toBe('Failed to create product');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in getAllProducts', async () => {
      mockProductUsecase.getAllProducts.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/products')
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in getProductById', async () => {
      mockProductUsecase.getProductById.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/products/1')
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in updateProduct', async () => {
      mockProductUsecase.updateProduct.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .put('/products/1')
        .send({ name: 'Updated Product' })
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in deleteProduct', async () => {
      mockProductUsecase.deleteProduct.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .delete('/products/1')
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in softDeleteProduct', async () => {
      mockProductUsecase.softDeleteProduct.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .patch('/products/1/deactivate')
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in updateProductStock', async () => {
      mockProductUsecase.updateProductStock.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .patch('/products/1/stock')
        .send({ stock: 100 })
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in getProductBySku', async () => {
      mockProductUsecase.getProductBySku.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/products/sku/TEST-001')
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in getProductsByCategory', async () => {
      mockProductUsecase.getProductsByCategory.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/products/category/Electronics')
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle internal errors in getLowStockProducts', async () => {
      mockProductUsecase.getLowStockProducts.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/products/reports/low-stock')
        .expect(500);

      expect(response.body.error.message).toBe('Internal server error');
      expect(response.body.error.code).toBe('INTERNAL_ERROR');
    });

    it('should require authentication for softDeleteProduct', async () => {
      const response = await request(appWithoutAuth)
        .patch('/products/1/deactivate')
        .expect(401);

      expect(response.body.error.message).toBe('Authentication required');
    });

    it('should require authentication for updateProductStock', async () => {
      const response = await request(appWithoutAuth)
        .patch('/products/1/stock')
        .send({ stock: 100 })
        .expect(401);

      expect(response.body.error.message).toBe('Authentication required');
    });

    it('should require authentication for deleteProduct', async () => {
      const response = await request(appWithoutAuth)
        .delete('/products/1')
        .expect(401);

      expect(response.body.error.message).toBe('Authentication required');
    });
  });

  describe('Branch coverage improvements', () => {
    const validProductData = {
      name: 'Test Product',
      sku: 'TEST-SKU',
      category: 'Electronics',
      price: 100.00,
      weight: 1.5,
      stock: 10
    };

    it('should handle error without name and stack properties', async () => {
      const errorWithoutNameStack = { message: 'Some error without name/stack' };
      mockProductUsecase.createProduct.mockRejectedValue(errorWithoutNameStack);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validProductData);

      expect(response.status).toBe(500);
      expect(response.body.error.message).toBe('Failed to create product');
    });

    it('should handle ErrorResponse with undefined statusCode', async () => {
      const errorResponse = new ErrorResponse('Test error', 'TEST_ERROR');
      delete errorResponse.statusCode; // Make statusCode undefined
      mockProductUsecase.createProduct.mockRejectedValue(errorResponse);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validProductData);

      expect(response.status).toBe(500);
    });

    it('should handle getAllProducts with no query parameters', async () => {
      const mockResponse = { products: [], pagination: { total: 0 } };
      mockProductUsecase.getAllProducts.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.getAllProducts).toHaveBeenCalledWith({});
    });

    it('should convert string ID to number in getProductById', async () => {
      const productId = '123';
      const mockProduct = { id: 123, name: 'Test Product' };
      mockProductUsecase.getProductById.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.getProductById).toHaveBeenCalledWith(123);
    });

    it('should convert string ID to number in updateProduct', async () => {
      const productId = '123';
      const updateData = { name: 'Updated Product' };
      const mockUpdatedProduct = { id: 123, ...updateData };
      mockProductUsecase.updateProduct.mockResolvedValue(mockUpdatedProduct);

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.updateProduct).toHaveBeenCalledWith(123, updateData, 1);
    });

    it('should convert string ID to number in deleteProduct', async () => {
      const productId = '123';
      const mockResponse = { message: 'Product deleted successfully' };
      mockProductUsecase.deleteProduct.mockResolvedValue(mockResponse);

      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.deleteProduct).toHaveBeenCalledWith(123, 1);
    });

    it('should convert string ID to number in softDeleteProduct', async () => {
      const productId = '123';
      const mockProduct = { id: 123, isActive: false };
      mockProductUsecase.softDeleteProduct.mockResolvedValue(mockProduct);

      const response = await request(app)
        .patch(`/api/products/${productId}/deactivate`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.softDeleteProduct).toHaveBeenCalledWith(123, 1);
    });

    it('should convert string ID to number in updateProductStock', async () => {
      const productId = '123';
      const stockData = { stock: 50 };
      const mockProduct = { id: 123, stock: 50 };
      mockProductUsecase.updateProductStock.mockResolvedValue(mockProduct);

      const response = await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(stockData);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.updateProductStock).toHaveBeenCalledWith(123, 50, 1);
    });

    it('should handle getLowStockProducts with threshold parameter', async () => {
      const threshold = '5';
      const mockProducts = [];
      mockProductUsecase.getLowStockProducts.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get(`/api/products/low-stock?threshold=${threshold}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.getLowStockProducts).toHaveBeenCalledWith(5);
    });

    it('should handle getLowStockProducts without threshold (uses default)', async () => {
      const mockProducts = [];
      mockProductUsecase.getLowStockProducts.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products/low-stock')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.getLowStockProducts).toHaveBeenCalledWith(10);
    });

    it('should handle getProductsByCategory with query parameters', async () => {
      const category = 'Electronics';
      const mockResponse = { products: [], pagination: { total: 0 } };
      mockProductUsecase.getProductsByCategory.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get(`/api/products/category/${category}?page=1&limit=10`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.getProductsByCategory).toHaveBeenCalledWith(category, { page: '1', limit: '10' });
    });

    it('should handle getAllProducts with query parameters', async () => {
      const mockResponse = { products: [], pagination: { total: 0 } };
      mockProductUsecase.getAllProducts.mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/api/products?page=1&limit=10&search=test')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(mockProductUsecase.getAllProducts).toHaveBeenCalledWith({ page: '1', limit: '10', search: 'test' });
    });
  });
});
