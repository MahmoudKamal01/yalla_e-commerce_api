const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {
  uploadMultipleImages,
} = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Product = require("../models/productModel");
const Brand = require("../models/brandModel");
const slugify = require("slugify");
const ApiFeatures = require("../utils/apiFeatures");

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
  //1- Image processing for imageCover
  if (req.files && req.files.imageCover) {
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
  if (req.files && req.files.images) {
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
  }
  // Always continue to next middleware even when no files provided
  next();
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
  // Apply filters and search using ApiFeatures
  const baseFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .search("Products");

  // Count filtered documents for pagination
  const filteredCount = await baseFeatures.mongooseQuery
    .clone()
    .countDocuments();

  // Apply sorting by sold (descending) - this is the main feature of this endpoint
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;

  // Get filtered and sorted products
  const products = await baseFeatures.mongooseQuery
    .sort("-sold")
    .skip(skip)
    .limit(limit);

  // Build pagination result
  const numberOfPages = Math.ceil(filteredCount / limit);
  const paginationResult = {
    currentPage: page,
    limit,
    numberOfPages,
  };

  if (endIndex < filteredCount) {
    paginationResult.next = page + 1;
  }
  if (skip > 0) {
    paginationResult.prev = page - 1;
  }

  res.status(200).json({
    results: products.length,
    paginationResult,
    data: products,
  });
});

// @desc    Get products on sale (ordered by discount amount desc)
// @route   GET /api/v1/products/sales
// @access  Public
exports.getSalesProducts = asyncHandler(async (req, res) => {
  // Apply filters using ApiFeatures first
  const baseFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .search("Products");

  // Get the base query conditions
  const baseQuery = baseFeatures.mongooseQuery.getQuery();

  // Pagination params
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  // Combine base filters with sales condition using aggregation
  const matchStage = {
    ...baseQuery,
    priceAfterDiscount: { $exists: true, $ne: null },
    $expr: { $lt: ["$priceAfterDiscount", "$price"] },
  };

  // Use aggregation to calculate discount and sort
  const products = await Product.aggregate([
    {
      $match: matchStage,
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

  // Get total count of filtered products on sale
  const totalSalesProducts = await Product.countDocuments(matchStage);
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

// @desc    Migration: add dummy brands and random details/dimensions/brand to products
// @route   POST /api/v1/products/migrate/dummy
// @access  Private (Admin/Manager)
exports.migrateDummyProductsAndBrands = asyncHandler(async (req, res) => {
  // 1) Upsert a set of dummy brands
  const dummyBrandNames = [
    "Acme",
    "Globex",
    "Initech",
    "Umbrella",
    "Soylent",
    "Stark",
    "Wayne",
    "Wonka",
  ];

  const brandDocs = [];
  for (const name of dummyBrandNames) {
    const doc = await Brand.findOneAndUpdate(
      { name },
      { name, slug: slugify(name) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    brandDocs.push(doc);
  }

  // 2) Prepare random generators
  const detailsPool = [
    "Classic porcelain dinner plate with smooth glaze.",
    "Premium stainless steel water bottle with double-wall insulation.",
    "Soft cotton crew-neck t-shirt with breathable fabric.",
    "Ergonomic wireless mouse with adjustable DPI.",
    "Durable bamboo cutting board with juice groove.",
  ];

  const dimensionSets = [
    {
      diameter: "26 cm",
      height: "2 cm",
      weight: "650 g",
      material: "Porcelain",
    },
    {
      diameter: "22 cm",
      height: "1.8 cm",
      weight: "520 g",
      material: "Stoneware",
    },
    {
      diameter: "18 cm",
      height: "1.5 cm",
      weight: "400 g",
      material: "Ceramic",
    },
    {
      diameter: "30 cm",
      height: "2.2 cm",
      weight: "780 g",
      material: "Porcelain",
    },
  ];

  const bool = () => Math.random() < 0.5;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 3) Update all products with random details/dimensions and random brand
  const products = await Product.find({});
  for (const p of products) {
    p.details = pick(detailsPool);
    const dims = pick(dimensionSets);
    p.dimensions = {
      diameter: dims.diameter,
      height: dims.height,
      weight: dims.weight,
      material: dims.material,
      dishwasherSafe: bool(),
      microwaveSafe: bool(),
    };
    if (brandDocs.length > 0) {
      p.brand = pick(brandDocs)._id;
    }
    await p.save();
  }

  res.status(200).json({
    status: "success",
    brandsCreatedOrUpdated: brandDocs.length,
    productsUpdated: products.length,
  });
});
