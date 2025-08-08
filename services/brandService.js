const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brandModel");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find().skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    results: brands.length,
    page,
    limit,
    data: {
      brands,
    },
  });
});

// @desc get a single brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findById(id);

  if (!brand) {
    return next(new ApiError(`Brand with id ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      brand,
    },
  });
});

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  if (!name) {
    return next(new ApiError("Brand name is required", 400));
  }
  const newBrand = await BrandModel.create({
    name,
    slug: slugify(name, { lower: true }),
  });

  res.status(201).json({
    status: "success",
    data: {
      brand: newBrand,
    },
  });
});

// @desc    Update a brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name, { lower: true }),
    },
    { new: true }
  );

  if (!brand) {
    return next(new ApiError(`Brand with id ${id} not found`, 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      brand,
    },
  });
});

// @desc    Delete a brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`Brand with id ${id} not found`, 404));
  }

  res.status(204).send();
});
