const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    results: categories.length,
    page,
    limit,
    data: {
      categories,
    },
  });
});

// @desc get a single category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);

  if (!category) {
    return next(new ApiError(`Category with id ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  if (!name) {
    return next(new ApiError("Category name is required", 400));
  }
  const newCategory = await CategoryModel.create({
    name,
    slug: slugify(name, { lower: true }),
  });

  res.status(201).json({
    status: "success",
    data: {
      category: newCategory,
    },
  });
});

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name, { lower: true }),
    },
    { new: true }
  );

  if (!category) {
    return next(new ApiError(`Category with id ${id} not found`, 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`Category with id ${id} not found`, 404));
  }

  res.status(204).send();
});
