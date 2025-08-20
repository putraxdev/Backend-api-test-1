const { ProductResponse, ProductListResponse } = require('../src/dto/productResponse');

describe('Product Response DTOs', () => {
  describe('ProductResponse', () => {
    const mockProduct = {
       const mockPagination = {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      }; 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100.50,
      sku: 'TEST-001',
      category: 'Electronics',
      stock: 25,
      isActive: true,
      weight: '1.50',
      dimensions: {
        length: 10,
        width: 5,
        height: 3
      },
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z'),
      createdBy: 1,
      updatedBy: 1
    };

    it('should create product response with all fields', () => {
      const response = new ProductResponse(mockProduct);

      expect(response.id).toBe(1);
      expect(response.name).toBe('Test Product');
      expect(response.description).toBe('Test Description');
      expect(response.price).toBe(100.50);
      expect(response.sku).toBe('TEST-001');
      expect(response.category).toBe('Electronics');
      expect(response.stock).toBe(25);
      expect(response.isActive).toBe(true);
      expect(response.weight).toBe(1.5); // Should be number, not string
      expect(response.dimensions).toEqual({
        length: 10,
        width: 5,
        height: 3
      });
      expect(response.createdAt).toEqual(new Date('2023-01-01T00:00:00Z'));
      expect(response.updatedAt).toEqual(new Date('2023-01-02T00:00:00Z'));
      expect(response.createdBy).toBe(1);
      expect(response.updatedBy).toBe(1);
    });

    it('should handle null/undefined fields gracefully', () => {
      const productWithNulls = {
        id: 1,
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        description: null,
        weight: null,
        dimensions: null,
        stock: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1
      };

      const response = new ProductResponse(productWithNulls);

      expect(response.description).toBeNull();
      expect(response.weight).toBeNull();
      expect(response.dimensions).toBeNull();
      expect(response.stock).toBe(0);
    });

    it('should create response from database model instance', () => {
      const mockDbProduct = {
        ...mockProduct,
        toJSON: () => mockProduct
      };

      const response = new ProductResponse(mockDbProduct);
      expect(response.id).toBe(mockProduct.id);
      expect(response.name).toBe(mockProduct.name);
    });

    it('should handle product with minimal required fields', () => {
      const minimalProduct = {
        id: 1,
        name: 'Minimal Product',
        price: 10.00,
        sku: 'MIN-001',
        category: 'Test',
        stock: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1
      };

      const response = new ProductResponse(minimalProduct);

      expect(response.id).toBe(1);
      expect(response.name).toBe('Minimal Product');
      expect(response.price).toBe(10.00);
      expect(response.sku).toBe('MIN-001');
      expect(response.category).toBe('Test');
      expect(response.stock).toBe(0);
      expect(response.isActive).toBe(true);
    });

    it('should preserve data types correctly', () => {
      const response = new ProductResponse(mockProduct);

      expect(typeof response.id).toBe('number');
      expect(typeof response.name).toBe('string');
      expect(typeof response.price).toBe('number');
      expect(typeof response.stock).toBe('number');
      expect(typeof response.isActive).toBe('boolean');
      expect(response.createdAt instanceof Date).toBe(true);
      expect(response.updatedAt instanceof Date).toBe(true);
    });

    it('should handle complex dimensions object', () => {
      const productWithComplexDimensions = {
        ...mockProduct,
        dimensions: {
          length: 15.5,
          width: 10.2,
          height: 5.8,
          unit: 'cm',
          volume: 888.51
        }
      };

      const response = new ProductResponse(productWithComplexDimensions);

      expect(response.dimensions).toEqual({
        length: 15.5,
        width: 10.2,
        height: 5.8,
        unit: 'cm',
        volume: 888.51
      });
    });
  });

  describe('ProductListResponse', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        price: 100.00,
        sku: 'PROD-001',
        category: 'Electronics',
        stock: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1
      },
      {
        id: 2,
        name: 'Product 2',
        price: 200.00,
        sku: 'PROD-002',
        category: 'Books',
        stock: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1
      }
    ];

    const mockPagination = {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    };

    it('should create product list response with pagination', () => {
      const response = new ProductListResponse(mockProducts, mockPagination);

      expect(response.products).toHaveLength(2);
      expect(response.products[0]).toBeInstanceOf(ProductResponse);
      expect(response.products[1]).toBeInstanceOf(ProductResponse);
      expect(response.pagination).toEqual(mockPagination);
    });

    it('should handle empty product list', () => {
      const emptyPagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

      const response = new ProductListResponse([], emptyPagination);

      expect(response.products).toHaveLength(0);
      expect(response.pagination).toEqual(emptyPagination);
    });

    it('should create product responses for each product', () => {
      const response = new ProductListResponse(mockProducts, mockPagination);

      expect(response.products[0].id).toBe(1);
      expect(response.products[0].name).toBe('Product 1');
      expect(response.products[0].price).toBe(100.00);
      
      expect(response.products[1].id).toBe(2);
      expect(response.products[1].name).toBe('Product 2');
      expect(response.products[1].price).toBe(200.00);
    });

    it('should handle pagination with different values', () => {
      const paginationWithNext = {
        page: 1,
        limit: 1,
        total: 2,
        totalPages: 2,
      };

      const response = new ProductListResponse([mockProducts[0]], paginationWithNext);

      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(1);
      expect(response.pagination.totalPages).toBe(2);
    });

    it('should handle pagination with previous page', () => {
      const paginationWithPrev = {
        page: 2,
        limit: 1,
        total: 2,
        totalPages: 2,
      };

      const response = new ProductListResponse([mockProducts[1]], paginationWithPrev);

      expect(response.pagination.page).toBe(2);
      expect(response.pagination.limit).toBe(1);
      expect(response.pagination.total).toBe(2);
    });

    it('should maintain product data integrity in list', () => {
      const response = new ProductListResponse(mockProducts, mockPagination);

      response.products.forEach((product, index) => {
        expect(product.id).toBe(mockProducts[index].id);
        expect(product.name).toBe(mockProducts[index].name);
        expect(product.sku).toBe(mockProducts[index].sku);
        expect(product.category).toBe(mockProducts[index].category);
      });
    });
  });
});
