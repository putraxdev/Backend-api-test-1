const ProductUsecase = require('../src/usecases/productUsecase');
const { ErrorResponse } = require('../src/dto/errorResponse');

// Mock the ProductRepository
jest.mock('../src/repositories/productRepository');

describe('Product Usecase', () => {
  let productUsecase;
  let mockProductRepository;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock repository instance
    mockProductRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
      updateStock: jest.fn(),
      findByCategory: jest.fn(),
      findLowStock: jest.fn(),
    };

    // Create usecase with mocked repository
    productUsecase = new ProductUsecase(mockProductRepository);
  });

  describe('createProduct', () => {
    const validProductData = {
      name: 'Test Product',
      description: 'Test description',
      price: 99.99,
      sku: 'TEST-001',
      category: 'Electronics',
      stock: 50,
    };

    const userId = 1;

    it('should create product successfully', async () => {
      const mockProduct = { id: 1, ...validProductData, createdBy: userId };

      mockProductRepository.findBySku.mockResolvedValue(null);
      mockProductRepository.create.mockResolvedValue(mockProduct);

      const result = await productUsecase.createProduct(validProductData, userId);

      expect(mockProductRepository.findBySku).toHaveBeenCalledWith(validProductData.sku);
      expect(mockProductRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(validProductData),
        userId,
      );
      expect(result.id).toBe(1);
      expect(result.name).toBe(validProductData.name);
    });

    it('should throw validation error for invalid data', async () => {
      const invalidData = {
        // Missing required fields
        description: 'Test description',
      };

      await expect(productUsecase.createProduct(invalidData, userId))
        .rejects.toThrow(ErrorResponse);
    });

    it('should throw error if SKU already exists', async () => {
      const existingProduct = { id: 2, sku: validProductData.sku };

      mockProductRepository.findBySku.mockResolvedValue(existingProduct);

      await expect(productUsecase.createProduct(validProductData, userId))
        .rejects.toThrow('SKU already exists');
    });

    it('should handle database errors', async () => {
      mockProductRepository.findBySku.mockResolvedValue(null);
      mockProductRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(productUsecase.createProduct(validProductData, userId))
        .rejects.toThrow('Failed to create product');
    });
  });

  describe('getAllProducts', () => {
    it('should return all products with pagination', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      };

      mockProductRepository.findAll.mockResolvedValue({
        products: mockProducts,
        pagination: mockPagination,
      });

      const result = await productUsecase.getAllProducts();

      expect(mockProductRepository.findAll).toHaveBeenCalledWith({});
      expect(result.products).toHaveLength(2);
      expect(result.pagination).toEqual(mockPagination);
    });

    it('should pass options to repository', async () => {
      const options = {
        page: 2,
        limit: 5,
        search: 'test',
        category: 'Electronics',
      };

      mockProductRepository.findAll.mockResolvedValue({
        products: [],
        pagination: {
          page: 2, limit: 5, total: 0, totalPages: 0,
        },
      });

      await productUsecase.getAllProducts(options);

      expect(mockProductRepository.findAll).toHaveBeenCalledWith(options);
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };

      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await productUsecase.getProductById(1);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Product');
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.getProductById(999))
        .rejects.toThrow('Product not found');
    });
  });

  describe('getProductBySku', () => {
    it('should return product when found', async () => {
      const mockProduct = { id: 1, sku: 'TEST-001', name: 'Test Product' };

      mockProductRepository.findBySku.mockResolvedValue(mockProduct);

      const result = await productUsecase.getProductBySku('TEST-001');

      expect(mockProductRepository.findBySku).toHaveBeenCalledWith('TEST-001');
      expect(result.sku).toBe('TEST-001');
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findBySku.mockResolvedValue(null);

      await expect(productUsecase.getProductBySku('NON-EXISTENT'))
        .rejects.toThrow('Product not found');
    });
  });

  describe('updateProduct', () => {
    const updateData = {
      name: 'Updated Product',
      price: 149.99,
    };

    const userId = 1;

    it('should update product successfully', async () => {
      const existingProduct = { id: 1, sku: 'TEST-001' };
      const updatedProduct = { ...existingProduct, ...updateData, updatedBy: userId };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const result = await productUsecase.updateProduct(1, updateData, userId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining(updateData),
        userId,
      );
      expect(result.name).toBe(updateData.name);
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.updateProduct(999, updateData, userId))
        .rejects.toThrow('Product not found');
    });

    it('should check SKU uniqueness when updating SKU', async () => {
      const existingProduct = { id: 1, sku: 'OLD-SKU' };
      const updateWithSku = { ...updateData, sku: 'NEW-SKU' };
      const skuExists = { id: 2, sku: 'NEW-SKU' };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.findBySku.mockResolvedValue(skuExists);

      await expect(productUsecase.updateProduct(1, updateWithSku, userId))
        .rejects.toThrow('SKU already exists');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const existingProduct = { id: 1, name: 'Test Product' };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.delete.mockResolvedValue(true);

      const result = await productUsecase.deleteProduct(1);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
      expect(result.message).toBe('Product deleted successfully');
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.deleteProduct(999))
        .rejects.toThrow('Product not found');
    });
  });

  describe('updateProductStock', () => {
    const userId = 1;

    it('should update stock successfully', async () => {
      const existingProduct = { id: 1, stock: 10 };
      const updatedProduct = { ...existingProduct, stock: 25, updatedBy: userId };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.updateStock.mockResolvedValue(updatedProduct);

      const result = await productUsecase.updateProductStock(1, 25, userId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.updateStock).toHaveBeenCalledWith(1, 25, userId);
      expect(result.stock).toBe(25);
    });

    it('should validate stock value', async () => {
      await expect(productUsecase.updateProductStock(1, -5, userId))
        .rejects.toThrow('Stock must be a non-negative integer');

      await expect(productUsecase.updateProductStock(1, 'invalid', userId))
        .rejects.toThrow('Stock must be a non-negative integer');
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.updateProductStock(999, 25, userId))
        .rejects.toThrow('Product not found');
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      const mockProducts = [
        { id: 1, category: 'Electronics' },
        { id: 2, category: 'Electronics' },
      ];

      mockProductRepository.findByCategory.mockResolvedValue(mockProducts);

      const result = await productUsecase.getProductsByCategory('Electronics');

      expect(mockProductRepository.findByCategory).toHaveBeenCalledWith('Electronics');
      expect(result).toHaveLength(2);
    });

    it('should validate category parameter', async () => {
      await expect(productUsecase.getProductsByCategory(''))
        .rejects.toThrow('Category is required');

      await expect(productUsecase.getProductsByCategory(null))
        .rejects.toThrow('Category is required');
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products with default threshold', async () => {
      const mockProducts = [
        { id: 1, stock: 5 },
        { id: 2, stock: 8 },
      ];

      mockProductRepository.findLowStock.mockResolvedValue(mockProducts);

      const result = await productUsecase.getLowStockProducts();

      expect(mockProductRepository.findLowStock).toHaveBeenCalledWith(10);
      expect(result).toHaveLength(2);
    });

    it('should use custom threshold', async () => {
      const mockProducts = [{ id: 1, stock: 3 }];

      mockProductRepository.findLowStock.mockResolvedValue(mockProducts);

      const result = await productUsecase.getLowStockProducts(5);

      expect(mockProductRepository.findLowStock).toHaveBeenCalledWith(5);
      expect(result).toHaveLength(1);
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle generic errors in getAllProducts', async () => {
      mockProductRepository.findAll.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.getAllProducts()).rejects.toThrow('Failed to fetch products');
    });

    it('should handle generic errors in getProductById', async () => {
      mockProductRepository.findById.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.getProductById(1)).rejects.toThrow('Failed to fetch product');
    });

    it('should handle generic errors in getProductBySku', async () => {
      mockProductRepository.findBySku.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.getProductBySku('TEST-001')).rejects.toThrow('Failed to fetch product');
    });

    it('should handle update errors when product is not found in updateProduct', async () => {
      const updateData = { name: 'Updated Product' };
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.updateProduct(999, updateData, 1)).rejects.toThrow('Product not found');
    });

    it('should handle SequelizeUniqueConstraintError in updateProduct', async () => {
      const updateData = { sku: 'EXISTING-SKU' };
      const existingProduct = { id: 1, name: 'Test Product' };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      const sequelizeError = new Error('Unique constraint violation');
      sequelizeError.name = 'SequelizeUniqueConstraintError';
      mockProductRepository.update.mockRejectedValue(sequelizeError);

      await expect(productUsecase.updateProduct(1, updateData, 1)).rejects.toThrow('SKU already exists');
    });

    it('should handle SequelizeValidationError in updateProduct', async () => {
      const updateData = { price: -10 };
      const existingProduct = { id: 1, name: 'Test Product' };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      const sequelizeError = new Error('Validation error');
      sequelizeError.name = 'SequelizeValidationError';
      sequelizeError.errors = [{ message: 'Price must be positive' }];
      mockProductRepository.update.mockRejectedValue(sequelizeError);

      await expect(productUsecase.updateProduct(1, updateData, 1)).rejects.toThrow('Price must be a positive number');
    });

    it('should handle generic errors in updateProduct', async () => {
      const updateData = { name: 'Updated Product' };
      const existingProduct = { id: 1, name: 'Test Product' };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.updateProduct(1, updateData, 1)).rejects.toThrow('Failed to update product');
    });

    it('should handle delete errors when product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.deleteProduct(999, 1)).rejects.toThrow('Product not found');
    });

    it('should handle delete errors when deletion fails', async () => {
      const existingProduct = { id: 1, name: 'Test Product' };
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.delete.mockResolvedValue(false);

      await expect(productUsecase.deleteProduct(1, 1)).rejects.toThrow('Failed to delete product');
    });

    it('should handle generic errors in deleteProduct', async () => {
      const existingProduct = { id: 1, name: 'Test Product' };
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.delete.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.deleteProduct(1, 1)).rejects.toThrow('Failed to delete product');
    });

    it('should handle soft delete errors when product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.softDeleteProduct(999, 1)).rejects.toThrow('Product not found');
    });

    it('should handle generic errors in softDeleteProduct', async () => {
      const existingProduct = { id: 1, name: 'Test Product' };
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.softDelete.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.softDeleteProduct(1, 1)).rejects.toThrow('Failed to deactivate product');
    });

    it('should handle updateStock errors when product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productUsecase.updateProductStock(999, 50, 1)).rejects.toThrow('Product not found');
    });

    it('should handle generic errors in updateProductStock', async () => {
      const existingProduct = { id: 1, name: 'Test Product' };
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.updateStock.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.updateProductStock(1, 50, 1)).rejects.toThrow('Failed to update product stock');
    });

    it('should handle generic errors in getProductsByCategory', async () => {
      mockProductRepository.findByCategory.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.getProductsByCategory('Electronics')).rejects.toThrow('Failed to fetch products by category');
    });

    it('should handle generic errors in getLowStockProducts', async () => {
      mockProductRepository.findLowStock.mockRejectedValue(new Error('Database connection failed'));

      await expect(productUsecase.getLowStockProducts(5)).rejects.toThrow('Failed to fetch low stock products');
    });
  });
});
