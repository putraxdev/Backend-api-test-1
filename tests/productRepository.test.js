const ProductRepository = require('../src/repositories/productRepository');
const { Product, User, sequelize } = require('../src/models/testModels');

// Mock the actual models
jest.mock('../src/models/product', () => require('../src/models/testModels').Product);
jest.mock('../src/models/user', () => require('../src/models/testModels').User);

describe('Product Repository', () => {
  let productRepository;
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    productRepository = new ProductRepository();

    // Create a test user
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

  describe('create', () => {
    it('should create a product successfully', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        sku: 'TEST-001',
        category: 'Electronics',
        stock: 50,
      };

      const result = await productRepository.create(productData, testUser.id);

      expect(result).toBeDefined();
      expect(result.name).toBe(productData.name);
      expect(result.createdBy).toBe(testUser.id);
      expect(result.creator).toBeDefined();
      expect(result.creator.id).toBe(testUser.id);
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      // Create test products
      await Product.bulkCreate([
        {
          name: 'Laptop Gaming',
          description: 'High performance laptop',
          price: 15000000,
          sku: 'LP-001',
          category: 'Electronics',
          stock: 10,
          createdBy: testUser.id,
        },
        {
          name: 'Mouse Gaming',
          description: 'RGB gaming mouse',
          price: 500000,
          sku: 'MS-001',
          category: 'Electronics',
          stock: 25,
          createdBy: testUser.id,
        },
        {
          name: 'Keyboard Mechanical',
          description: 'Blue switch mechanical keyboard',
          price: 1200000,
          sku: 'KB-001',
          category: 'Electronics',
          stock: 15,
          createdBy: testUser.id,
        },
        {
          name: 'Office Chair',
          description: 'Ergonomic office chair',
          price: 2500000,
          sku: 'CH-001',
          category: 'Furniture',
          stock: 5,
          isActive: false,
          createdBy: testUser.id,
        },
      ]);
    });

    it('should return all products with default pagination', async () => {
      const result = await productRepository.findAll();

      expect(result.products).toHaveLength(4);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(4);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should support pagination', async () => {
      const result = await productRepository.findAll({ page: 1, limit: 2 });

      expect(result.products).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.total).toBe(4);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should support search by name', async () => {
      const result = await productRepository.findAll({ search: 'Gaming' });

      expect(result.products).toHaveLength(2);
      expect(result.products.every((p) => p.name.includes('Gaming'))).toBe(true);
    });

    it('should support category filter', async () => {
      const result = await productRepository.findAll({ category: 'Electronics' });

      expect(result.products).toHaveLength(3);
      expect(result.products.every((p) => p.category === 'Electronics')).toBe(true);
    });

    it('should support isActive filter', async () => {
      const result = await productRepository.findAll({ isActive: true });

      expect(result.products).toHaveLength(3);
      expect(result.products.every((p) => p.isActive === true)).toBe(true);
    });

    it('should support price range filter', async () => {
      const result = await productRepository.findAll({
        minPrice: 1000000,
        maxPrice: 5000000,
      });

      expect(result.products.length).toBeGreaterThan(0);
      expect(result.products.every((p) => parseFloat(p.price) >= 1000000
        && parseFloat(p.price) <= 5000000)).toBe(true);
    });

    it('should support sorting', async () => {
      const result = await productRepository.findAll({
        sortBy: 'price',
        sortOrder: 'ASC',
      });

      expect(result.products).toHaveLength(4);

      for (let i = 1; i < result.products.length; i += 1) {
        expect(parseFloat(result.products[i].price))
          .toBeGreaterThanOrEqual(parseFloat(result.products[i - 1].price));
      }
    });
  });

  describe('findById', () => {
    it('should find product by id', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-001',
        category: 'Test',
        createdBy: testUser.id,
      });

      const result = await productRepository.findById(product.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(product.id);
      expect(result.creator).toBeDefined();
    });

    it('should return null for non-existent product', async () => {
      const result = await productRepository.findById(999999);

      expect(result).toBeNull();
    });
  });

  describe('findBySku', () => {
    it('should find product by sku', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 99.99,
        sku: 'UNIQUE-SKU-001',
        category: 'Test',
        createdBy: testUser.id,
      });

      const result = await productRepository.findBySku('UNIQUE-SKU-001');

      expect(result).toBeDefined();
      expect(result.id).toBe(product.id);
      expect(result.sku).toBe('UNIQUE-SKU-001');
    });

    it('should return null for non-existent sku', async () => {
      const result = await productRepository.findBySku('NON-EXISTENT-SKU');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const product = await Product.create({
        name: 'Original Product',
        price: 99.99,
        sku: 'UPD-001',
        category: 'Original',
        createdBy: testUser.id,
      });

      const updateData = {
        name: 'Updated Product',
        price: 149.99,
      };

      const result = await productRepository.update(product.id, updateData, testUser.id);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Product');
      expect(parseFloat(result.price)).toBe(149.99);
      expect(result.updatedBy).toBe(testUser.id);
    });

    it('should return null for non-existent product', async () => {
      const result = await productRepository.update(999999, { name: 'Updated' }, testUser.id);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      const product = await Product.create({
        name: 'Delete Test',
        price: 99.99,
        sku: 'DEL-001',
        category: 'Test',
        createdBy: testUser.id,
      });

      const result = await productRepository.delete(product.id);

      expect(result).toBe(true);

      const deletedProduct = await productRepository.findById(product.id);
      expect(deletedProduct).toBeNull();
    });

    it('should return false for non-existent product', async () => {
      const result = await productRepository.delete(999999);

      expect(result).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('should soft delete product (set isActive to false)', async () => {
      const product = await Product.create({
        name: 'Soft Delete Test',
        price: 99.99,
        sku: 'SOFT-001',
        category: 'Test',
        createdBy: testUser.id,
      });

      const result = await productRepository.softDelete(product.id, testUser.id);

      expect(result).toBeDefined();
      expect(result.isActive).toBe(false);
      expect(result.updatedBy).toBe(testUser.id);
    });
  });

  describe('updateStock', () => {
    it('should update product stock', async () => {
      const product = await Product.create({
        name: 'Stock Test',
        price: 99.99,
        sku: 'STOCK-001',
        category: 'Test',
        stock: 10,
        createdBy: testUser.id,
      });

      const result = await productRepository.updateStock(product.id, 25, testUser.id);

      expect(result).toBeDefined();
      expect(result.stock).toBe(25);
      expect(result.updatedBy).toBe(testUser.id);
    });
  });

  describe('findByCategory', () => {
    beforeEach(async () => {
      await Product.bulkCreate([
        {
          name: 'Electronics Product 1',
          price: 100,
          sku: 'ELEC-001',
          category: 'Electronics',
          createdBy: testUser.id,
        },
        {
          name: 'Electronics Product 2',
          price: 200,
          sku: 'ELEC-002',
          category: 'Electronics',
          createdBy: testUser.id,
        },
        {
          name: 'Furniture Product',
          price: 300,
          sku: 'FURN-001',
          category: 'Furniture',
          createdBy: testUser.id,
        },
      ]);
    });

    it('should find products by category', async () => {
      const result = await productRepository.findByCategory('Electronics');

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.category === 'Electronics')).toBe(true);
      expect(result.every((p) => p.isActive === true)).toBe(true);
    });
  });

  describe('findLowStock', () => {
    beforeEach(async () => {
      await Product.bulkCreate([
        {
          name: 'Low Stock Product 1',
          price: 100,
          sku: 'LOW-001',
          category: 'Test',
          stock: 5,
          createdBy: testUser.id,
        },
        {
          name: 'Low Stock Product 2',
          price: 200,
          sku: 'LOW-002',
          category: 'Test',
          stock: 8,
          createdBy: testUser.id,
        },
        {
          name: 'High Stock Product',
          price: 300,
          sku: 'HIGH-001',
          category: 'Test',
          stock: 50,
          createdBy: testUser.id,
        },
      ]);
    });

    it('should find products with low stock', async () => {
      const result = await productRepository.findLowStock(10);

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.stock <= 10)).toBe(true);
      expect(result.every((p) => p.isActive === true)).toBe(true);
    });

    it('should use default threshold of 10', async () => {
      const result = await productRepository.findLowStock();

      expect(result).toHaveLength(2);
    });
  });
});
