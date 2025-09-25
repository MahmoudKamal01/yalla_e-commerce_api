const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const {
  deleteImageMiddleware,
} = require("../middlewares/deleteImageMiddleware");
// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeCategoryImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;
  next();
};

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);

// @desc    Delete category image
exports.deleteCategoryImage = deleteImageMiddleware({
  model: Category,
  folder: "categories",
});
