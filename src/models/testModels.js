const { DataTypes } = require('sequelize');
const sequelize = require('./testDb');

// Define User model for testing (simplified)
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

// Define Product model for testing
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Product name is required',
      },
      notEmpty: {
        msg: 'Product name cannot be empty',
      },
      len: {
        args: [2, 255],
        msg: 'Product name must be between 2 and 255 characters',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Price is required',
      },
      min: {
        args: [0],
        msg: 'Price must be greater than or equal to 0',
      },
    },
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'SKU is required',
      },
      notEmpty: {
        msg: 'SKU cannot be empty',
      },
    },
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Category is required',
      },
      notEmpty: {
        msg: 'Category cannot be empty',
      },
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stock must be greater than or equal to 0',
      },
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Weight must be greater than or equal to 0',
      },
    },
  },
  dimensions: {
    type: DataTypes.TEXT, // SQLite doesn't support JSON, use TEXT
    allowNull: true,
    get() {
      const value = this.getDataValue('dimensions');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('dimensions', value ? JSON.stringify(value) : null);
    },
    validate: {
      isValidDimensions(value) {
        if (value && typeof value === 'object') {
          const { length, width, height } = value;
          if (length !== undefined && (typeof length !== 'number' || length < 0)) {
            throw new Error('Length must be a positive number');
          }
          if (width !== undefined && (typeof width !== 'number' || width < 0)) {
            throw new Error('Width must be a positive number');
          }
          if (height !== undefined && (typeof height !== 'number' || height < 0)) {
            throw new Error('Height must be a positive number');
          }
        }
      },
    },
  },
  tags: {
    type: DataTypes.TEXT, // SQLite doesn't support JSON, use TEXT
    allowNull: true,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'products',
  timestamps: true,
  hooks: {
    beforeUpdate: (product, options) => {
      if (options.userId) {
        product.updatedBy = options.userId;
      }
    },
  },
});

// Associations
Product.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator',
});

Product.belongsTo(User, {
  foreignKey: 'updatedBy',
  as: 'updater',
});

User.hasMany(Product, {
  foreignKey: 'createdBy',
  as: 'createdProducts',
});

User.hasMany(Product, {
  foreignKey: 'updatedBy',
  as: 'updatedProducts',
});

module.exports = {
  User,
  Product,
  sequelize,
};
