const factory = require("./handlersFactory");
const Product = require("../models/productModel");
const multer = require("multer");
const ApiError = require("../utils/apiError");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const {
  uploadMultipleImages,
} = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // Resize imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save imageCover to the product
    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    const imageFilesNames = await Promise.all(
      req.files.images.map(async (file, index) => {
        const fileName = `product-${uuidv4()}-${Date.now()}-${index + 1}-${
          file.originalname
        }.jpeg`;
        await sharp(file.buffer)
          .resize(500, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName}`);
        return fileName;
      })
    );
    req.body.images = imageFilesNames;
  }

  next();
});

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product);

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
