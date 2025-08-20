/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const Product = require('../models/product');
const User = require('../models/user');

class ProductRepository {
  async create(productData, userId) {
    try {
      const product = await Product.create({
        ...productData,
        createdBy: userId,
      });

      return await this.findById(product.id);
    } catch (error) {
      throw error;
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        minPrice,
        maxPrice,
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Search by name, description, or SKU
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { sku: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Filter by category
      if (category) {
        whereClause.category = { [Op.iLike]: `%${category}%` };
      }

      // Filter by active status
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      // Filter by price range
      if (minPrice !== undefined || maxPrice !== undefined) {
        whereClause.price = {};
        if (minPrice !== undefined) {
          whereClause.price[Op.gte] = minPrice;
        }
        if (maxPrice !== undefined) {
          whereClause.price[Op.lte] = maxPrice;
        }
      }

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit, 10),
        offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      return {
        products: rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const product = await Product.findByPk(id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  async findBySku(sku) {
    try {
      const product = await Product.findOne({
        where: { sku },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  async update(id, productData, userId) {
    try {
      const [updatedRowsCount] = await Product.update(
        {
          ...productData,
          updatedBy: userId,
        },
        {
          where: { id },
          userId, // This will trigger the beforeUpdate hook
        },
      );

      if (updatedRowsCount === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const deletedRowsCount = await Product.destroy({
        where: { id },
      });

      return deletedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id, userId) {
    try {
      return await this.update(id, { isActive: false }, userId);
    } catch (error) {
      throw error;
    }
  }

  async updateStock(id, stock, userId) {
    try {
      const [updatedRowsCount] = await Product.update(
        {
          stock,
          updatedBy: userId,
        },
        {
          where: { id },
          userId,
        },
      );

      if (updatedRowsCount === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findByCategory(category) {
    try {
      const products = await Product.findAll({
        where: {
          category: { [Op.iLike]: `%${category}%` },
          isActive: true,
        },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username', 'email'],
          },
        ],
        order: [['name', 'ASC']],
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  async findLowStock(threshold = 10) {
    try {
      const products = await Product.findAll({
        where: {
          stock: { [Op.lte]: threshold },
          isActive: true,
        },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email'],
          },
        ],
        order: [['stock', 'ASC']],
      });

      return products;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductRepository;
