/* eslint-disable no-useless-catch */
const { Op } = require('sequelize');
const Product = require('../models/product');
const User = require('../models/user');

class ProductRepository {
  // Helper method to get case-insensitive operator based on database dialect
  getCaseInsensitiveOp() {
    const dialect = Product.sequelize.getDialect();
    return dialect === 'postgres' ? Op.iLike : Op.like;
  }

  async create(productData, userId) {
    try {
      const product = await Product.create({
        ...productData,
        createdBy: userId,
      });

      return product;
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
        const likeOp = this.getCaseInsensitiveOp();
        whereClause[Op.or] = [
          { name: { [likeOp]: `%${search}%` } },
          { description: { [likeOp]: `%${search}%` } },
          { sku: { [likeOp]: `%${search}%` } },
        ];
      }

      // Filter by category
      if (category) {
        const likeOp = this.getCaseInsensitiveOp();
        whereClause.category = { [likeOp]: `%${category}%` };
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
            attributes: ['id', 'username'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username'],
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
            attributes: ['id', 'username'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username'],
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
            attributes: ['id', 'username'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username'],
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
      const likeOp = this.getCaseInsensitiveOp();
      const products = await Product.findAll({
        where: {
          category: { [likeOp]: `%${category}%` },
          isActive: true,
        },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username'],
          },
          {
            model: User,
            as: 'updater',
            attributes: ['id', 'username'],
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
            attributes: ['id', 'username'],
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
