const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  getBestSellerProducts,
  getSalesProducts,
} = require("../services/productService");
const authService = require("../services/authService");
const reviewsRoute = require("./reviewRoute");

const router = express.Router();

// IMPORTANT: Specific routes must be defined BEFORE parameterized routes
// to prevent them from being matched as :id parameters

/**
 * @swagger
 * /api/v1/products/best-seller:
 *   get:
 *     summary: Get best seller products
 *     description: Retrieve products ordered by the number sold (highest to lowest)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of best seller products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   description: Number of products returned
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/best-seller", getBestSellerProducts);

/**
 * @swagger
 * /api/v1/products/sales:
 *   get:
 *     summary: Get products on sale
 *     description: Retrieve products with discounts, ordered by discount amount (highest to lowest)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of products on sale with discount information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   description: Number of products returned
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/sales", getSalesProducts);

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
// NOTE: This nested route must be AFTER specific routes but BEFORE the generic /:id route
router.use("/:productId/reviews", reviewsRoute);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products with filtering, sorting, pagination, and search
 *     description: |
 *       Retrieve products with advanced filtering options:
 *       - Filter by category, brand, subcategory
 *       - Price range filters (gte, lte, gt, lt)
 *       - Rating filters
 *       - Quantity and sold filters
 *       - Search by keyword
 *       - Sort by any field (prefix with - for descending)
 *       - Paginate results
 *       - Select specific fields to return
 *
 *       **Examples:**
 *       - Get products in a category: `?category=67088f1ccae5a012e4e49a09`
 *       - Price range $100-$500: `?price[gte]=100&price[lte]=500`
 *       - Highly rated: `?ratingsAverage[gte]=4.5`
 *       - Sort by price descending: `?sort=-price`
 *       - Multiple filters: `?category=ID&brand=ID&price[gte]=100&ratingsAverage[gte]=4`
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of products per page
 *         example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field(s). Use comma for multiple fields. Prefix with - for descending order
 *         example: -price,ratingsAverage
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Select specific fields to return (comma-separated)
 *         example: title,price,imageCover,ratingsAverage
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword in title and description
 *         example: laptop
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *         example: 67088f1ccae5a012e4e49a09
 *       - in: query
 *         name: subcategory
 *         schema:
 *           type: string
 *         description: Filter by subcategory ID
 *         example: 67088f1ccae5a012e4e49a10
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand ID
 *         example: 67088f1ccae5a012e4e49a11
 *       - in: query
 *         name: price[gte]
 *         schema:
 *           type: number
 *         description: Minimum price (greater than or equal)
 *         example: 100
 *       - in: query
 *         name: price[lte]
 *         schema:
 *           type: number
 *         description: Maximum price (less than or equal)
 *         example: 500
 *       - in: query
 *         name: price[gt]
 *         schema:
 *           type: number
 *         description: Price greater than
 *         example: 99
 *       - in: query
 *         name: price[lt]
 *         schema:
 *           type: number
 *         description: Price less than
 *         example: 501
 *       - in: query
 *         name: ratingsAverage[gte]
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Minimum average rating (1-5)
 *         example: 4.5
 *       - in: query
 *         name: ratingsAverage[lte]
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Maximum average rating (1-5)
 *         example: 5
 *       - in: query
 *         name: ratingsQuantity[gte]
 *         schema:
 *           type: number
 *         description: Minimum number of ratings
 *         example: 10
 *       - in: query
 *         name: quantity[gte]
 *         schema:
 *           type: number
 *         description: Minimum quantity in stock
 *         example: 1
 *       - in: query
 *         name: quantity[lte]
 *         schema:
 *           type: number
 *         description: Maximum quantity in stock
 *         example: 100
 *       - in: query
 *         name: sold[gte]
 *         schema:
 *           type: number
 *         description: Minimum number sold
 *         example: 50
 *       - in: query
 *         name: priceAfterDiscount[gte]
 *         schema:
 *           type: number
 *         description: Minimum discounted price
 *         example: 80
 *       - in: query
 *         name: priceAfterDiscount[lte]
 *         schema:
 *           type: number
 *         description: Maximum discounted price
 *         example: 400
 *     responses:
 *       200:
 *         description: List of products successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   description: Number of products returned
 *                   example: 10
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     numberOfPages:
 *                       type: integer
 *                       example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - quantity
 *               - price
 *               - category
 *               - brand
 *             properties:
 *               title:
 *                 type: string
 *                 description: Product title
 *               description:
 *                 type: string
 *                 description: Product description
 *               quantity:
 *                 type: number
 *                 description: Available quantity
 *               price:
 *                 type: number
 *                 description: Product price
 *               priceAfterDiscount:
 *                 type: number
 *                 description: Price after discount
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Available colors
 *               category:
 *                 type: string
 *                 description: Category ID
 *               subcategory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Subcategory IDs
 *               brand:
 *                 type: string
 *                 description: Brand ID
 *               imageCover:
 *                 type: string
 *                 format: binary
 *                 description: Cover image
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin/Manager access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Product title
 *               description:
 *                 type: string
 *                 description: Product description
 *               quantity:
 *                 type: number
 *                 description: Available quantity
 *               price:
 *                 type: number
 *                 description: Product price
 *               priceAfterDiscount:
 *                 type: number
 *                 description: Price after discount
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Available colors
 *               category:
 *                 type: string
 *                 description: Category ID
 *               subcategory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Subcategory IDs
 *               brand:
 *                 type: string
 *                 description: Brand ID
 *               imageCover:
 *                 type: string
 *                 format: binary
 *                 description: Cover image
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin/Manager access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
