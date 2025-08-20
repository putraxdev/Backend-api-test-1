const ProductUsecase = require('../usecases/productUsecase');
const { ErrorResponse } = require('../dto/errorResponse');

class ProductController {
  // Helper method to format ErrorResponse for consistent API responses
  formatErrorResponse(error) {
    if (error instanceof ErrorResponse) {
      return {
        message: error.error.message,
        code: error.error.code,
        timestamp: error.error.timestamp,
      };
    }
    return error;
  }
  constructor() {
    this.productUsecase = new ProductUsecase();
  }

  async createProduct(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        const authError = new ErrorResponse('Authentication required', 'UNAUTHORIZED', 401);
        return res.status(401).json(this.formatErrorResponse(authError));
      }

      const product = await this.productUsecase.createProduct(req.body, userId);
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      console.error('Create product error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      if (error.name && error.stack) {
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      }

      return res.status(500).json(new ErrorResponse('Failed to create product', 'INTERNAL_ERROR'));
    }
  }

  async getAllProducts(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        search: req.query.search,
        category: req.query.category,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'DESC',
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      };

      const result = await this.productUsecase.getAllProducts(options);
      return res.json({
        success: true,
        message: 'Products fetched successfully',
        data: result,
      });
    } catch (error) {
      console.error('Get all products error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productUsecase.getProductById(id);

      return res.json({
        success: true,
        message: 'Product fetched successfully',
        data: product,
      });
    } catch (error) {
      console.error('Get product by ID error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async getProductBySku(req, res) {
    try {
      const { sku } = req.params;
      const product = await this.productUsecase.getProductBySku(sku);

      return res.json({
        success: true,
        message: 'Product fetched successfully',
        data: product,
      });
    } catch (error) {
      console.error('Get product by SKU error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        const authError = new ErrorResponse('Authentication required', 'UNAUTHORIZED', 401);
        return res.status(401).json(this.formatErrorResponse(authError));
      }

      const product = await this.productUsecase.updateProduct(id, req.body, userId);

      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      console.error('Update product error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await this.productUsecase.deleteProduct(id);

      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error('Delete product error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async softDeleteProduct(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        const authError = new ErrorResponse("Authentication required", "UNAUTHORIZED", 401);
        return res.status(401).json(this.formatErrorResponse(authError));
      }

      const product = await this.productUsecase.softDeleteProduct(id, userId);

      return res.json({
        success: true,
        message: 'Product deactivated successfully',
        data: product,
      });
    } catch (error) {
      console.error('Soft delete product error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async updateProductStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        const authError = new ErrorResponse("Authentication required", "UNAUTHORIZED", 401);
        return res.status(401).json(this.formatErrorResponse(authError));
      }

      const product = await this.productUsecase.updateProductStock(id, stock, userId);

      return res.json({
        success: true,
        message: 'Product stock updated successfully',
        data: product,
      });
    } catch (error) {
      console.error('Update product stock error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await this.productUsecase.getProductsByCategory(category);

      return res.json({
        success: true,
        message: 'Products fetched successfully',
        data: products,
      });
    } catch (error) {
      console.error('Get products by category error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }

  async getLowStockProducts(req, res) {
    try {
      const threshold = parseInt(req.query.threshold, 10) || 10;
      const products = await this.productUsecase.getLowStockProducts(threshold);

      return res.json({
        success: true,
        message: 'Low stock products fetched successfully',
        data: products,
      });
    } catch (error) {
      console.error('Get low stock products error:', error);

      if (error instanceof ErrorResponse) {
        return res.status(error.statusCode || 500).json(this.formatErrorResponse(error));
      }

      return res.status(500).json(new ErrorResponse('Internal server error', 'INTERNAL_ERROR'));
    }
  }
}

module.exports = { ProductController };
