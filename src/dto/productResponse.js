class ProductResponse {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = parseFloat(product.price);
    this.sku = product.sku;
    this.category = product.category;
    this.stock = product.stock;
    this.isActive = product.isActive;
    this.weight = product.weight ? parseFloat(product.weight) : null;
    this.dimensions = product.dimensions;
    this.tags = product.tags;
    this.createdBy = product.createdBy;
    this.updatedBy = product.updatedBy;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;

    // Include creator and updater information if available
    if (product.creator) {
      this.creator = {
        id: product.creator.id,
        username: product.creator.username,
        email: product.creator.email,
      };
    }

    if (product.updater) {
      this.updater = {
        id: product.updater.id,
        username: product.updater.username,
        email: product.updater.email,
      };
    }
  }

  static fromProduct(product) {
    return new ProductResponse(product);
  }

  static fromProducts(products) {
    return products.map((product) => new ProductResponse(product));
  }
}

class ProductListResponse {
  constructor(products, pagination = {}) {
    this.products = ProductResponse.fromProducts(products);
    this.pagination = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || products.length,
      totalPages: pagination.totalPages || Math.ceil((pagination.total || products.length) / (pagination.limit || 10)),
    };
  }
}

module.exports = {
  ProductResponse,
  ProductListResponse,
};
