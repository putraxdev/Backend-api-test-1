const { ProductRequest, ProductUpdateRequest } = require('../src/dto/productRequest');

describe('Product Request DTOs', () => {
  describe('ProductRequest validation', () => {
    it('should validate valid product data', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        description: 'Test Description',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        stock: 25,
        weight: 1.5,
        dimensions: { length: 10, width: 5, height: 3 },
        tags: ['tag1', 'tag2']
      });

      const errors = request.validate();
      expect(errors).toEqual([]);
    });

    it('should validate category requirement', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: '', // Empty category
      });

      const errors = request.validate();
      expect(errors).toContain('Category is required');
    });

    it('should validate missing category', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        // No category
      });

      const errors = request.validate();
      expect(errors).toContain('Category is required');
    });

    it('should validate negative stock', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        stock: -5
      });

      const errors = request.validate();
      expect(errors).toContain('Stock must be a non-negative integer');
    });

    it('should validate negative weight', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        weight: -1.5
      });

      const errors = request.validate();
      expect(errors).toContain('Weight must be a positive number');
    });

    it('should validate negative dimensions', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        dimensions: { length: -10, width: 5, height: 3 }
      });

      const errors = request.validate();
      expect(errors).toContain('Dimensions length must be a positive number');
    });

    it('should validate negative width in dimensions', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        dimensions: { length: 10, width: -5, height: 3 }
      });

      const errors = request.validate();
      expect(errors).toContain('Dimensions width must be a positive number');
    });

    it('should validate negative height in dimensions', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        dimensions: { length: 10, width: 5, height: -3 }
      });

      const errors = request.validate();
      expect(errors).toContain('Dimensions height must be a positive number');
    });

    it('should validate invalid tags array', () => {
      const request = new ProductRequest({
        name: 'Test Product',
        price: 100.50,
        sku: 'TEST-001',
        category: 'Electronics',
        tags: 'not-an-array'
      });

      const errors = request.validate();
      expect(errors).toContain('Tags must be an array');
    });
  });

  describe('ProductUpdateRequest validation', () => {
    it('should validate valid update data', () => {
      const request = new ProductUpdateRequest({
        name: 'Updated Product',
        price: 150.00,
        category: 'Updated Category'
      });

      const errors = request.validate();
      expect(errors).toEqual([]);
    });

    it('should validate undefined name (optional in update)', () => {
      const request = new ProductUpdateRequest({
        price: 150.00
        // name is undefined, which is allowed in updates
      });

      const errors = request.validate();
      expect(errors).not.toContain(expect.stringContaining('Name'));
    });

    it('should validate empty SKU in update', () => {
      const request = new ProductUpdateRequest({
        sku: ''
      });

      const errors = request.validate();
      expect(errors).toContain('SKU cannot be empty');
    });

    it('should validate empty category in update', () => {
      const request = new ProductUpdateRequest({
        category: ''
      });

      const errors = request.validate();
      expect(errors).toContain('Category cannot be empty');
    });

    it('should validate negative stock in update', () => {
      const request = new ProductUpdateRequest({
        stock: -10
      });

      const errors = request.validate();
      expect(errors).toContain('Stock must be a non-negative integer');
    });

    it('should validate negative weight in update', () => {
      const request = new ProductUpdateRequest({
        weight: -2.5
      });

      const errors = request.validate();
      expect(errors).toContain('Weight must be a positive number');
    });

    it('should validate negative dimensions in update', () => {
      const request = new ProductUpdateRequest({
        dimensions: { length: -10, width: 5, height: 3 }
      });

      const errors = request.validate();
      expect(errors).toContain('Dimensions length must be a positive number');
    });

    it('should validate negative width in dimensions for update', () => {
      const request = new ProductUpdateRequest({
        dimensions: { length: 10, width: -5, height: 3 }
      });

      const errors = request.validate();
      expect(errors).toContain('Dimensions width must be a positive number');
    });

    it('should validate negative height in dimensions for update', () => {
      const request = new ProductUpdateRequest({
        dimensions: { length: 10, width: 5, height: -3 }
      });

      const errors = request.validate();
      expect(errors).toContain('Dimensions height must be a positive number');
    });

    it('should validate invalid tags in update', () => {
      const request = new ProductUpdateRequest({
        tags: 'not-an-array'
      });

      const errors = request.validate();
      expect(errors).toContain('Tags must be an array');
    });

    it('should allow partial updates', () => {
      const request = new ProductUpdateRequest({});
      
      const errors = request.validate();
      expect(errors).toEqual([]);
    });
  });
});
