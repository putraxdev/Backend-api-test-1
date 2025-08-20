const { Product } = require('../src/models/testModels');
const { DataTypes } = require('sequelize');

describe('Product Model', () => {
  describe('validation tests', () => {
    test('should validate dimensions correctly - positive numbers', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: 10,
        width: 5,
        height: 3,
        createdBy: 1,
        updatedBy: 1
      });

      // Test valid dimensions
      expect(() => product.validate()).not.toThrow();
    });

    test('should reject negative length', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: -1,
        width: 5,
        height: 3,
        createdBy: 1,
        updatedBy: 1
      });

      await expect(product.validate()).rejects.toThrow('Length must be a positive number');
    });

    test('should reject zero length', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: 0,
        width: 5,
        height: 3,
        createdBy: 1,
        updatedBy: 1
      });

      await expect(product.validate()).rejects.toThrow('Length must be a positive number');
    });

    test('should reject negative width', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: 10,
        width: -1,
        height: 3,
        createdBy: 1,
        updatedBy: 1
      });

      await expect(product.validate()).rejects.toThrow('Width must be a positive number');
    });

    test('should reject zero width', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: 10,
        width: 0,
        height: 3,
        createdBy: 1,
        updatedBy: 1
      });

      await expect(product.validate()).rejects.toThrow('Width must be a positive number');
    });

    test('should reject negative height', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: 10,
        width: 5,
        height: -1,
        createdBy: 1,
        updatedBy: 1
      });

      await expect(product.validate()).rejects.toThrow('Height must be a positive number');
    });

    test('should reject zero height', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: 10,
        width: 5,
        height: 0,
        createdBy: 1,
        updatedBy: 1
      });

      await expect(product.validate()).rejects.toThrow('Height must be a positive number');
    });
  });

  describe('beforeUpdate hook tests', () => {
    test('should set updatedBy in beforeUpdate hook', async () => {
      const product = Product.build({
        name: 'Test Product',
        sku: 'TEST123',
        price: 100.00,
        weight: 1.5,
        length: 10,
        width: 5,
        height: 3,
        createdBy: 1,
        updatedBy: 1
      });

      // Mock the beforeUpdate hook
      const hookOptions = { where: { id: 1 } };
      const hookInstance = {
        changed: () => true,
        get: (field) => field === 'updatedBy' ? 1 : 'value',
        set: jest.fn()
      };

      // Get the beforeUpdate hook
      const hooks = Product.options.hooks;
      const beforeUpdateHook = hooks.beforeUpdate[0];

      // Call the hook
      await beforeUpdateHook.call(Product, hookInstance, hookOptions);

      // Verify updatedBy was set
      expect(hookInstance.set).toHaveBeenCalledWith('updatedBy', 1);
    });

    test('should handle beforeUpdate hook without changes', async () => {
      const hookInstance = {
        changed: () => false,
        get: (field) => field === 'updatedBy' ? 1 : 'value',
        set: jest.fn()
      };

      const hooks = Product.options.hooks;
      const beforeUpdateHook = hooks.beforeUpdate[0];

      await beforeUpdateHook.call(Product, hookInstance, {});

      expect(hookInstance.set).toHaveBeenCalledWith('updatedBy', 1);
    });
  });

  describe('model associations and structure', () => {
    test('should have correct model name', () => {
      expect(Product.name).toBe('Product');
    });

    test('should have correct table name', () => {
      expect(Product.tableName).toBe('Products');
    });

    test('should have all required fields defined', () => {
      const attributes = Product.getTableName ? Object.keys(Product.rawAttributes) : Object.keys(Product.attributes);
      
      expect(attributes).toContain('id');
      expect(attributes).toContain('name');
      expect(attributes).toContain('sku');
      expect(attributes).toContain('description');
      expect(attributes).toContain('price');
      expect(attributes).toContain('weight');
      expect(attributes).toContain('length');
      expect(attributes).toContain('width');
      expect(attributes).toContain('height');
      expect(attributes).toContain('tags');
      expect(attributes).toContain('createdBy');
      expect(attributes).toContain('updatedBy');
    });
  });
});