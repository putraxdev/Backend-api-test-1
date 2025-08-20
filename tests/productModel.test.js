const { Product } = require('../src/models/testModels');

describe('Product Model', () => {
  describe('dimensions validation tests', () => {
    test('should validate dimensions correctly - positive numbers', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 3,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      // Test valid dimensions
      await expect(product.validate()).resolves.not.toThrow();
    });

    test('should reject negative length in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: -1,
          width: 5,
          height: 3,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).rejects.toThrow('Length must be a positive number');
    });

    test('should allow zero length in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 0,
          width: 5,
          height: 3,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).resolves.not.toThrow();
    });

    test('should reject negative width in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 10,
          width: -1,
          height: 3,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).rejects.toThrow('Width must be a positive number');
    });

    test('should allow zero width in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 10,
          width: 0,
          height: 3,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).resolves.not.toThrow();
    });

    test('should reject negative height in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 10,
          width: 5,
          height: -1,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).rejects.toThrow('Height must be a positive number');
    });

    test('should allow zero height in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 0,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).resolves.not.toThrow();
    });

    test('should reject non-number length in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 'invalid',
          width: 5,
          height: 3,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).rejects.toThrow('Length must be a positive number');
    });

    test('should reject non-number width in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 10,
          width: 'invalid',
          height: 3,
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).rejects.toThrow('Width must be a positive number');
    });

    test('should reject non-number height in dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 'invalid',
        },
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).rejects.toThrow('Height must be a positive number');
    });

    test('should allow null dimensions', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: null,
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).resolves.not.toThrow();
    });

    test('should allow empty dimensions object', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        category: 'Electronics',
        price: 100.00,
        weight: 1.5,
        dimensions: {},
        createdBy: 1,
        updatedBy: 1,
      });

      await expect(product.validate()).resolves.not.toThrow();
    });
  });

  describe('beforeUpdate hook tests', () => {
    test('should set updatedBy when userId is provided in options', async () => {
      const mockProduct = {
        updatedBy: null,
      };

      const options = { userId: 42 };

      // Get the beforeUpdate hook (it's an array)
      const { hooks } = Product.options;
      const beforeUpdateHook = hooks.beforeUpdate[0];

      // Call the hook
      beforeUpdateHook(mockProduct, options);

      // Verify updatedBy was set
      expect(mockProduct.updatedBy).toBe(42);
    });

    test('should not set updatedBy when userId is not provided in options', async () => {
      const mockProduct = {
        updatedBy: 1,
      };

      const options = {}; // No userId

      // Get the beforeUpdate hook (it's an array)
      const { hooks } = Product.options;
      const beforeUpdateHook = hooks.beforeUpdate[0];

      // Call the hook
      beforeUpdateHook(mockProduct, options);

      // Verify updatedBy was not changed
      expect(mockProduct.updatedBy).toBe(1);
    });

    test('should not set updatedBy when userId is null in options', async () => {
      const mockProduct = {
        updatedBy: 1,
      };

      const options = { userId: null };

      // Get the beforeUpdate hook (it's an array)
      const { hooks } = Product.options;
      const beforeUpdateHook = hooks.beforeUpdate[0];

      // Call the hook
      beforeUpdateHook(mockProduct, options);

      // Verify updatedBy was not changed
      expect(mockProduct.updatedBy).toBe(1);
    });
  });

  describe('model associations and structure', () => {
    test('should have correct model name', () => {
      expect(Product.name).toBe('Product');
    });

    test('should have correct table name', () => {
      expect(Product.tableName).toBe('products');
    });

    test('should have all required fields defined', () => {
      const attributes = Product.getTableName
        ? Object.keys(Product.rawAttributes)
        : Object.keys(Product.attributes);

      expect(attributes).toContain('id');
      expect(attributes).toContain('name');
      expect(attributes).toContain('sku');
      expect(attributes).toContain('description');
      expect(attributes).toContain('price');
      expect(attributes).toContain('weight');
      expect(attributes).toContain('dimensions');
      expect(attributes).toContain('tags');
      expect(attributes).toContain('createdBy');
      expect(attributes).toContain('updatedBy');
      expect(attributes).toContain('category');
      expect(attributes).toContain('stock');
      expect(attributes).toContain('isActive');
    });
  });
});
