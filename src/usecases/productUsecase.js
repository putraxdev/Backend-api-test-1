const ProductRepository = require('../repositories/productRepository');
const { ProductRequest, ProductUpdateRequest } = require('../dto/productRequest');
const { ProductResponse, ProductListResponse } = require('../dto/productResponse');
const { ErrorResponse } = require('../dto/errorResponse');

class ProductUsecase {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(productData, userId) {
    try {
      const productRequest = ProductRequest.fromBody(productData);
      const validationErrors = productRequest.validate();

      if (validationErrors.length > 0) {
        throw new ErrorResponse(validationErrors.join(', '), 'VALIDATION_ERROR', 400);
      }

      // Check if SKU already exists
      const existingProduct = await this.productRepository.findBySku(productRequest.sku);
      if (existingProduct) {
        throw new ErrorResponse('SKU already exists', 'DUPLICATE_SKU', 409);
      }

      const product = await this.productRepository.create(productRequest, userId);
      return ProductResponse.fromProduct(product);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ErrorResponse('SKU already exists', 'DUPLICATE_SKU', 409);
      }

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        throw new ErrorResponse(validationErrors.join(', '), 'VALIDATION_ERROR', 400);
      }

      throw new ErrorResponse('Failed to create product', 'INTERNAL_ERROR', 500);
    }
  }

  async getAllProducts(options = {}) {
    try {
      const result = await this.productRepository.findAll(options);
      return new ProductListResponse(result.products, result.pagination);
    } catch (error) {
      throw new ErrorResponse('Failed to fetch products', 'INTERNAL_ERROR', 500);
    }
  }

  async getProductById(id) {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) {
        throw new ErrorResponse('Product not found', 'NOT_FOUND', 404);
      }

      return ProductResponse.fromProduct(product);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse('Failed to fetch product', 'INTERNAL_ERROR', 500);
    }
  }

  async getProductBySku(sku) {
    try {
      const product = await this.productRepository.findBySku(sku);

      if (!product) {
        throw new ErrorResponse('Product not found', 'NOT_FOUND', 404);
      }

      return ProductResponse.fromProduct(product);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse('Failed to fetch product', 'INTERNAL_ERROR', 500);
    }
  }

  async updateProduct(id, productData, userId) {
    try {
      const productUpdateRequest = new ProductUpdateRequest(productData);
      const validationErrors = productUpdateRequest.validate();

      if (validationErrors.length > 0) {
        throw new ErrorResponse(validationErrors.join(', '), 'VALIDATION_ERROR', 400);
      }

      // Check if product exists
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new ErrorResponse('Product not found', 'NOT_FOUND', 404);
      }

      // Check if SKU is being updated and if it already exists
      if (productUpdateRequest.sku && productUpdateRequest.sku !== existingProduct.sku) {
        const skuExists = await this.productRepository.findBySku(productUpdateRequest.sku);
        if (skuExists) {
          throw new ErrorResponse('SKU already exists', 'DUPLICATE_SKU', 409);
        }
      }

      const updatedProduct = await this.productRepository.update(id, productUpdateRequest, userId);
      return ProductResponse.fromProduct(updatedProduct);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ErrorResponse('SKU already exists', 'DUPLICATE_SKU', 409);
      }

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        throw new ErrorResponse(validationErrors.join(', '), 'VALIDATION_ERROR', 400);
      }

      throw new ErrorResponse('Failed to update product', 'INTERNAL_ERROR', 500);
    }
  }

  async deleteProduct(id) {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new ErrorResponse('Product not found', 'NOT_FOUND', 404);
      }

      const isDeleted = await this.productRepository.delete(id);

      if (!isDeleted) {
        throw new ErrorResponse('Failed to delete product', 'INTERNAL_ERROR', 500);
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse('Failed to delete product', 'INTERNAL_ERROR', 500);
    }
  }

  async softDeleteProduct(id, userId) {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new ErrorResponse('Product not found', 'NOT_FOUND', 404);
      }

      const updatedProduct = await this.productRepository.softDelete(id, userId);
      return ProductResponse.fromProduct(updatedProduct);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse('Failed to deactivate product', 'INTERNAL_ERROR', 500);
    }
  }

  async updateProductStock(id, stock, userId) {
    try {
      if (stock === undefined || stock === null || Number.isNaN(stock) || parseInt(stock, 10) < 0) {
        throw new ErrorResponse('Stock must be a non-negative integer', 'VALIDATION_ERROR', 400);
      }

      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new ErrorResponse('Product not found', 'NOT_FOUND', 404);
      }

      const updatedProduct = await this.productRepository.updateStock(
        id,
        parseInt(stock, 10),
        userId,
      );
      return ProductResponse.fromProduct(updatedProduct);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse('Failed to update product stock', 'INTERNAL_ERROR', 500);
    }
  }

  async getProductsByCategory(category) {
    try {
      if (!category || category.trim().length === 0) {
        throw new ErrorResponse('Category is required', 'VALIDATION_ERROR', 400);
      }

      const products = await this.productRepository.findByCategory(category);
      return ProductResponse.fromProducts(products);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse('Failed to fetch products by category', 'INTERNAL_ERROR', 500);
    }
  }

  async getLowStockProducts(threshold = 10) {
    try {
      const products = await this.productRepository.findLowStock(threshold);
      return ProductResponse.fromProducts(products);
    } catch (error) {
      throw new ErrorResponse('Failed to fetch low stock products', 'INTERNAL_ERROR', 500);
    }
  }
}

module.exports = ProductUsecase;
