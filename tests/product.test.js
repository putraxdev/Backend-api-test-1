const { Product, User, sequelize } = require('../src/models/testModels');

describe('Product Model', () => {
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a test user for foreign key relationships
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Product.destroy({ where: {} });
  });

  describe('Product Creation', () => {
    it('should create a product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product description',
        price: 99.99,
        sku: 'TEST-001',
        category: 'Test Category',
        stock: 50,
        createdBy: testUser.id,
      };

      const product = await Product.create(productData);

      expect(product.id).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.description).toBe(productData.description);
      expect(parseFloat(product.price)).toBe(productData.price);
      expect(product.sku).toBe(productData.sku);
      expect(product.category).toBe(productData.category);
      expect(product.stock).toBe(productData.stock);
      expect(product.isActive).toBe(true);
      expect(product.createdBy).toBe(testUser.id);
      expect(product.createdAt).toBeDefined();
      expect(product.updatedAt).toBeDefined();
    });

    it('should create a product with optional fields', async () => {
      const productData = {
        name: 'Advanced Product',
        description: 'An advanced product with all features',
        price: 199.99,
        sku: 'ADV-001',
        category: 'Advanced',
        stock: 25,
        weight: 1.5,
        dimensions: {
          length: 10.5,
          width: 8.0,
          height: 2.5,
        },
        tags: ['premium', 'advanced', 'feature-rich'],
        createdBy: testUser.id,
      };

      const product = await Product.create(productData);

      expect(product.weight).toBe('1.50');
      expect(product.dimensions).toEqual(productData.dimensions);
      expect(product.tags).toEqual(productData.tags);
    });

    it('should set default values correctly', async () => {
      const productData = {
        name: 'Default Product',
        price: 49.99,
        sku: 'DEF-001',
        category: 'Default',
        createdBy: testUser.id,
      };

      const product = await Product.create(productData);

      expect(product.stock).toBe(0);
      expect(product.isActive).toBe(true);
      expect(product.tags).toEqual([]);
    });
  });

  describe('Product Validation', () => {
    it('should require name', async () => {
      const productData = {
        price: 99.99,
        sku: 'TEST-002',
        category: 'Test',
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should require price', async () => {
      const productData = {
        name: 'Test Product',
        sku: 'TEST-003',
        category: 'Test',
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should require sku', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        category: 'Test',
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should require category', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-004',
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should require unique sku', async () => {
      const productData1 = {
        name: 'Product 1',
        price: 99.99,
        sku: 'UNIQUE-001',
        category: 'Test',
        createdBy: testUser.id,
      };

      const productData2 = {
        name: 'Product 2',
        price: 149.99,
        sku: 'UNIQUE-001', // Same SKU
        category: 'Test',
        createdBy: testUser.id,
      };

      await Product.create(productData1);
      await expect(Product.create(productData2)).rejects.toThrow();
    });

    it('should validate name length', async () => {
      const productData = {
        name: 'A', // Too short
        price: 99.99,
        sku: 'TEST-005',
        category: 'Test',
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should validate negative price', async () => {
      const productData = {
        name: 'Test Product',
        price: -10.00, // Negative price
        sku: 'TEST-006',
        category: 'Test',
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should validate negative stock', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-007',
        category: 'Test',
        stock: -5, // Negative stock
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should validate negative weight', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-008',
        category: 'Test',
        weight: -1.0, // Negative weight
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });

    it('should validate dimensions', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-009',
        category: 'Test',
        dimensions: {
          length: -5.0, // Negative dimension
          width: 8.0,
          height: 2.5,
        },
        createdBy: testUser.id,
      };

      await expect(Product.create(productData)).rejects.toThrow();
    });
  });

  describe('Product Associations', () => {
    it('should associate with creator user', async () => {
      const productData = {
        name: 'Association Test',
        price: 99.99,
        sku: 'ASSOC-001',
        category: 'Test',
        createdBy: testUser.id,
      };

      const product = await Product.create(productData);
      const productWithCreator = await Product.findByPk(product.id, {
        include: [{ model: User, as: 'creator' }],
      });

      expect(productWithCreator.creator).toBeDefined();
      expect(productWithCreator.creator.id).toBe(testUser.id);
      expect(productWithCreator.creator.username).toBe(testUser.username);
    });

    it('should update updatedBy when modified', async () => {
      const productData = {
        name: 'Update Test',
        price: 99.99,
        sku: 'UPDATE-001',
        category: 'Test',
        createdBy: testUser.id,
      };

      const product = await Product.create(productData);

      await product.update(
        { name: 'Updated Product' },
        { userId: testUser.id },
      );

      await product.reload();
      expect(product.updatedBy).toBe(testUser.id);
    });
  });
});
