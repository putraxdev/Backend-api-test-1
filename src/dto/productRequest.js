class ProductRequest {
  constructor({
    name,
    description,
    price,
    sku,
    category,
    stock = 0,
    isActive = true,
    weight,
    dimensions,
    tags = [],
  }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.sku = sku;
    this.category = category;
    this.stock = stock;
    this.isActive = isActive;
    this.weight = weight;
    this.dimensions = dimensions;
    this.tags = tags;
  }

  static fromBody(body) {
    return new ProductRequest(body);
  }

  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string' || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.price || Number.isNaN(this.price) || parseFloat(this.price) < 0) {
      errors.push('Price must be a positive number');
    }

    if (!this.sku || typeof this.sku !== 'string' || this.sku.trim().length === 0) {
      errors.push('SKU is required');
    }

    if (!this.category || typeof this.category !== 'string' || this.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (this.stock !== undefined && (Number.isNaN(this.stock) || parseInt(this.stock, 10) < 0)) {
      errors.push('Stock must be a non-negative integer');
    }

    if (this.weight !== undefined && this.weight !== null
        && (Number.isNaN(this.weight) || parseFloat(this.weight) < 0)) {
      errors.push('Weight must be a positive number');
    }

    if (this.dimensions && typeof this.dimensions === 'object') {
      const { length, width, height } = this.dimensions;
      if (length !== undefined && (Number.isNaN(length) || parseFloat(length) < 0)) {
        errors.push('Dimensions length must be a positive number');
      }
      if (width !== undefined && (Number.isNaN(width) || parseFloat(width) < 0)) {
        errors.push('Dimensions width must be a positive number');
      }
      if (height !== undefined && (Number.isNaN(height) || parseFloat(height) < 0)) {
        errors.push('Dimensions height must be a positive number');
      }
    }

    if (this.tags && !Array.isArray(this.tags)) {
      errors.push('Tags must be an array');
    }

    return errors;
  }
}

class ProductUpdateRequest extends ProductRequest {
  validate() {
    const errors = [];

    if (this.name !== undefined && (typeof this.name !== 'string' || this.name.trim().length < 2)) {
      errors.push('Name must be at least 2 characters long');
    }

    if (this.price !== undefined && (Number.isNaN(this.price) || parseFloat(this.price) < 0)) {
      errors.push('Price must be a positive number');
    }

    if (this.sku !== undefined && (typeof this.sku !== 'string' || this.sku.trim().length === 0)) {
      errors.push('SKU cannot be empty');
    }

    if (this.category !== undefined && (typeof this.category !== 'string' || this.category.trim().length === 0)) {
      errors.push('Category cannot be empty');
    }

    if (this.stock !== undefined && (Number.isNaN(this.stock) || parseInt(this.stock, 10) < 0)) {
      errors.push('Stock must be a non-negative integer');
    }

    if (this.weight !== undefined && this.weight !== null
        && (Number.isNaN(this.weight) || parseFloat(this.weight) < 0)) {
      errors.push('Weight must be a positive number');
    }

    if (this.dimensions && typeof this.dimensions === 'object') {
      const { length, width, height } = this.dimensions;
      if (length !== undefined && (Number.isNaN(length) || parseFloat(length) < 0)) {
        errors.push('Dimensions length must be a positive number');
      }
      if (width !== undefined && (Number.isNaN(width) || parseFloat(width) < 0)) {
        errors.push('Dimensions width must be a positive number');
      }
      if (height !== undefined && (Number.isNaN(height) || parseFloat(height) < 0)) {
        errors.push('Dimensions height must be a positive number');
      }
    }

    if (this.tags !== undefined && !Array.isArray(this.tags)) {
      errors.push('Tags must be an array');
    }

    return errors;
  }
}

module.exports = {
  ProductRequest,
  ProductUpdateRequest,
};
