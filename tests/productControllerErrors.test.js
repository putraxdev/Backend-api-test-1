const ProductController = require('../src/controllers/productController');
const ProductUsecase = require('../src/usecases/productUsecase');
const ErrorResponse = require('../src/dto/errorResponse');

// Mock the ProductUsecase
jest.mock('../src/usecases/productUsecase');

describe('ProductController Error Paths', () => {
  let productController;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    productController = new ProductController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('getAllProducts error paths', () => {
    it('should handle usecase errors', async () => {
      const error = new Error('Database error');
      ProductUsecase.mockImplementation(() => ({
        getAllProducts: jest.fn().mockRejectedValue(error)
      }));

      await productController.getAllProducts(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });

    it('should handle ErrorResponse instances', async () => {
      const errorResponse = new ErrorResponse('Custom error', 'CUSTOM_ERROR', 400);
      ProductUsecase.mockImplementation(() => ({
        getAllProducts: jest.fn().mockRejectedValue(errorResponse)
      }));

      await productController.getAllProducts(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Custom error',
          code: 'CUSTOM_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('updateProduct error paths', () => {
    beforeEach(() => {
      mockReq.params.id = '1';
      mockReq.body = { name: 'Updated Product' };
    });

    it('should handle usecase errors', async () => {
      const error = new Error('Update failed');
      ProductUsecase.mockImplementation(() => ({
        updateProduct: jest.fn().mockRejectedValue(error)
      }));

      await productController.updateProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });

    it('should handle ErrorResponse with specific status', async () => {
      const errorResponse = new ErrorResponse('Product not found', 'NOT_FOUND', 404);
      ProductUsecase.mockImplementation(() => ({
        updateProduct: jest.fn().mockRejectedValue(errorResponse)
      }));

      await productController.updateProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Product not found',
          code: 'NOT_FOUND',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('deleteProduct error paths', () => {
    beforeEach(() => {
      mockReq.params.id = '1';
    });

    it('should handle usecase errors', async () => {
      const error = new Error('Delete failed');
      ProductUsecase.mockImplementation(() => ({
        deleteProduct: jest.fn().mockRejectedValue(error)
      }));

      await productController.deleteProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('softDeleteProduct error paths', () => {
    beforeEach(() => {
      mockReq.params.id = '1';
    });

    it('should handle usecase errors', async () => {
      const error = new Error('Soft delete failed');
      ProductUsecase.mockImplementation(() => ({
        softDeleteProduct: jest.fn().mockRejectedValue(error)
      }));

      await productController.softDeleteProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('updateProductStock error paths', () => {
    beforeEach(() => {
      mockReq.params.id = '1';
      mockReq.body = { stock: 25 };
    });

    it('should handle usecase errors', async () => {
      const error = new Error('Stock update failed');
      ProductUsecase.mockImplementation(() => ({
        updateProductStock: jest.fn().mockRejectedValue(error)
      }));

      await productController.updateProductStock(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('getProductBySku error paths', () => {
    beforeEach(() => {
      mockReq.params.sku = 'TEST-SKU';
    });

    it('should handle usecase errors', async () => {
      const error = new Error('SKU lookup failed');
      ProductUsecase.mockImplementation(() => ({
        getProductBySku: jest.fn().mockRejectedValue(error)
      }));

      await productController.getProductBySku(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('getProductsByCategory error paths', () => {
    beforeEach(() => {
      mockReq.params.category = 'Electronics';
    });

    it('should handle usecase errors', async () => {
      const error = new Error('Category lookup failed');
      ProductUsecase.mockImplementation(() => ({
        getProductsByCategory: jest.fn().mockRejectedValue(error)
      }));

      await productController.getProductsByCategory(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('getLowStockProducts error paths', () => {
    it('should handle usecase errors', async () => {
      const error = new Error('Low stock lookup failed');
      ProductUsecase.mockImplementation(() => ({
        getLowStockProducts: jest.fn().mockRejectedValue(error)
      }));

      await productController.getLowStockProducts(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });

  describe('formatErrorResponse helper', () => {
    it('should format error with all properties', () => {
      const errorResponse = new ErrorResponse('Test error', 'TEST_ERROR', 400);
      const formatted = productController.formatErrorResponse(errorResponse);

      expect(formatted).toEqual({
        success: false,
        error: {
          message: 'Test error',
          code: 'TEST_ERROR',
          timestamp: expect.any(String)
        }
      });
    });

    it('should handle error without statusCode', () => {
      const errorResponse = new ErrorResponse('Test error', 'TEST_ERROR');
      const formatted = productController.formatErrorResponse(errorResponse);

      expect(formatted).toEqual({
        success: false,
        error: {
          message: 'Test error',
          code: 'TEST_ERROR',
          timestamp: expect.any(String)
        }
      });
    });
  });
});
