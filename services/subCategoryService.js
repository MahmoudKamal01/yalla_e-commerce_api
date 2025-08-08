const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../models/subCategoryModel");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");

// To pass the validator of category
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// To pass the validator of category
exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj.category = req.params.categoryId;
  }
  req.filterObj = filterObj;
  next();
};

// @desc    Get all subCategories
// @route   GET /api/v1/subCategories
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const subCategories = await subCategoryModel
    .find(req.filterObj)
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: "success",
    results: subCategories.length,
    page,
    limit,
    data: {
      subCategories,
    },
  });
});

// @desc get a single subCategory by id
// @route GET /api/v1/subCategories/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await subCategoryModel.findById(id);

  if (!subCategory) {
    return next(new ApiError(`SubCategory with id ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});

// @desc    Create a new subCategory
// @route   POST /api/v1/subCategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  //Nested Route
  if (!category) {
    req.body.category = req.params.categoryId; // Set category from parent route if not provided
  }
  if (!name) {
    return next(new ApiError("SubCategory name is required", 400));
  }

  const newSubCategory = await subCategoryModel.create({
    name,
    category,
    slug: slugify(name, { lower: true }),
  });

  res.status(201).json({
    status: "success",
    data: {
      subCategory: newSubCategory,
    },
  });
});

// @desc    Update a subCategory
// @route   PUT /api/v1/subCategories/:id
// @access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id, name, category } = req.body;
  if (!name) {
    return next(new ApiError("SubCategory name is required", 400));
  }
  if (!category) {
    return next(new ApiError("SubCategory category is required", 400));
  }
  const subCategory = await subCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      category,
      slug: slugify(name, { lower: true }),
    },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`SubCategory with id ${id} not found`, 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});

// @desc    Delete a subCategory
// @route   DELETE /api/v1/subCategories/:id
// @access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await subCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`SubCategory with id ${id} not found`, 404));
  }

  res.status(204).send();
});
