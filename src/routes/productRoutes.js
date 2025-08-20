const express = require('express');
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();
const productController = new ProductController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - sku
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The product name
 *           minLength: 2
 *           maxLength: 255
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: number
 *           format: decimal
 *           description: The product price
 *           minimum: 0
 *         sku:
 *           type: string
 *           description: The product SKU (Stock Keeping Unit)
 *           maxLength: 100
 *         category:
 *           type: string
 *           description: The product category
 *           maxLength: 100
 *         stock:
 *           type: integer
 *           description: The product stock quantity
 *           minimum: 0
 *           default: 0
 *         isActive:
 *           type: boolean
 *           description: Whether the product is active
 *           default: true
 *         weight:
 *           type: number
 *           format: decimal
 *           description: The product weight
 *           minimum: 0
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               minimum: 0
 *             width:
 *               type: number
 *               minimum: 0
 *             height:
 *               type: number
 *               minimum: 0
 *           description: The product dimensions
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags
 *         createdBy:
 *           type: integer
 *           description: ID of the user who created the product
 *         updatedBy:
 *           type: integer
 *           description: ID of the user who last updated the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Product creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Product last update timestamp
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *           description: Creator user information
 *         updater:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *           description: Last updater user information
 *       example:
 *         id: 1
 *         name: "Laptop Gaming ASUS"
 *         description: "High performance gaming laptop"
 *         price: 15000000
 *         sku: "LP-ASUS-001"
 *         category: "Electronics"
 *         stock: 10
 *         isActive: true
 *         weight: 2.5
 *         dimensions:
 *           length: 35.5
 *           width: 25.0
 *           height: 2.5
 *         tags: ["gaming", "laptop", "asus"]
 *         createdBy: 1
 *         updatedBy: 1
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 * 
 *     ProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - sku
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *         sku:
 *           type: string
 *           maxLength: 100
 *         category:
 *           type: string
 *           maxLength: 100
 *         stock:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         isActive:
 *           type: boolean
 *           default: true
 *         weight:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *         dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               minimum: 0
 *             width:
 *               type: number
 *               minimum: 0
 *             height:
 *               type: number
 *               minimum: 0
 *         tags:
 *           type: array
 *           items:
 *             type: string
 * 
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 * 
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Product'
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *       409:
 *         description: SKU already exists
 */
router.post('/', authMiddleware, (req, res) => productController.createProduct(req, res));

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, description, or SKU
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */
router.get('/', (req, res) => productController.getAllProducts(req, res));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 */
router.get('/:id', (req, res) => productController.getProductById(req, res));

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Product not found
 *       409:
 *         description: SKU already exists
 */
router.put('/:id', authMiddleware, (req, res) => productController.updateProduct(req, res));

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID (hard delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Authentication required
 */
router.delete('/:id', authMiddleware, (req, res) => productController.deleteProduct(req, res));

/**
 * @swagger
 * /api/products/{id}/deactivate:
 *   patch:
 *     summary: Deactivate product (soft delete)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Authentication required
 */
router.patch('/:id/deactivate', authMiddleware, (req, res) => productController.softDeleteProduct(req, res));

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     summary: Update product stock
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: New stock quantity
 *     responses:
 *       200:
 *         description: Product stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Product not found
 */
router.patch('/:id/stock', authMiddleware, (req, res) => productController.updateProductStock(req, res));

/**
 * @swagger
 * /api/products/sku/{sku}:
 *   get:
 *     summary: Get product by SKU
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Product SKU
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 */
router.get('/sku/:sku', (req, res) => productController.getProductBySku(req, res));

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Product category
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/category/:category', (req, res) => productController.getProductsByCategory(req, res));

/**
 * @swagger
 * /api/products/reports/low-stock:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Stock threshold for low stock alert
 *     responses:
 *       200:
 *         description: Low stock products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/reports/low-stock', (req, res) => productController.getLowStockProducts(req, res));

module.exports = router;
