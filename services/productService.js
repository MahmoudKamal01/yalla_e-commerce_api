const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {
  uploadMultipleImages,
} = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Product = require("../models/productModel");

exports.uploadProductImages = uploadMultipleImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product);
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);

// @desc    Get best seller products (ordered by sold field desc)
// @route   GET /api/v1/products/best-seller
// @access  Public
exports.getBestSellerProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit * 1 || 10;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  // Get products ordered by sold field (descending)
  const products = await Product.find().sort("-sold").limit(limit).skip(skip);

  // Get total count for pagination
  const totalProducts = await Product.countDocuments();
  const numberOfPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    results: products.length,
    paginationResult: {
      currentPage: page,
      limit,
      numberOfPages,
    },
    data: products,
  });
});

// @desc    Get products on sale (ordered by discount amount desc)
// @route   GET /api/v1/products/sales
// @access  Public
exports.getSalesProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit * 1 || 10;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  // Get products that have priceAfterDiscount and calculate discount amount
  // Sort by discount amount (price - priceAfterDiscount) in descending order
  const products = await Product.aggregate([
    {
      $match: {
        priceAfterDiscount: { $exists: true, $ne: null },
        $expr: { $lt: ["$priceAfterDiscount", "$price"] },
      },
    },
    {
      $addFields: {
        discountAmount: { $subtract: ["$price", "$priceAfterDiscount"] },
      },
    },
    {
      $sort: { discountAmount: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  // Get total count of products on sale
  const totalSalesProducts = await Product.countDocuments({
    priceAfterDiscount: { $exists: true, $ne: null },
    $expr: { $lt: ["$priceAfterDiscount", "$price"] },
  });
  const numberOfPages = Math.ceil(totalSalesProducts / limit);

  res.status(200).json({
    results: products.length,
    paginationResult: {
      currentPage: page,
      limit,
      numberOfPages,
    },
    data: products,
  });
});
