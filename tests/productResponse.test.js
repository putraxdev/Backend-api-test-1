const { ProductResponse, ProductListResponse } = require('../src/dto/productResponse');

describe('Product Response DTOs', () => {
  describe('ProductResponse', () => {
    it('should include creator information when available', () => {
      const productWithCreator = {
        id: 1,
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        stock: 25,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
        creator: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      const response = new ProductResponse(productWithCreator);

      expect(response.creator).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should include updater information when available', () => {
      const productWithUpdater = {
        id: 1,
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        stock: 25,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 2,
        updater: {
          id: 2,
          username: 'updater',
          email: 'updater@example.com',
        },
      };

      const response = new ProductResponse(productWithUpdater);

      expect(response.updater).toEqual({
        id: 2,
        username: 'updater',
        email: 'updater@example.com',
      });
    });

    it('should work without creator and updater information', () => {
      const productWithoutUser = {
        id: 1,
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        stock: 25,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
      };

      const response = new ProductResponse(productWithoutUser);

      expect(response.creator).toBeUndefined();
      expect(response.updater).toBeUndefined();
    });
  });

  describe('ProductListResponse', () => {
    it('should create empty list response correctly', () => {
      const response = new ProductListResponse([]);

      expect(response.products).toEqual([]);
      expect(response.pagination.total).toBe(0);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(10);
    });

    it('should calculate pagination correctly', () => {
      const products = Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: 100,
        sku: `SKU-${i + 1}`,
        category: 'Test',
        stock: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
      }));

      const pagination = {
        page: 2,
        limit: 2,
        total: 5,
        totalPages: 3,
      };

      const response = new ProductListResponse(products, pagination);

      expect(response.products).toHaveLength(5);
      expect(response.pagination.page).toBe(2);
      expect(response.pagination.limit).toBe(2);
      expect(response.pagination.total).toBe(5);
      expect(response.pagination.totalPages).toBe(3);
    });
  });
});
