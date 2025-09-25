const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");
const ApiError = require("../apiError");
const { default: slugify } = require("slugify");
exports.createProductValidator = [
  (req, res, next) => {
    // Check imageCover exists
    if (!req.files?.imageCover) {
      return next(new ApiError("Product imageCover is required", 400));
    }

    // Validate imageCover type
    const coverFile = req.files.imageCover[0];
    if (!coverFile.mimetype.startsWith("image/")) {
      return next(new ApiError("imageCover must be an image file", 400));
    }

    // If images[] are optional but provided, validate them too
    if (req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        if (!file.mimetype.startsWith("image/")) {
          return next(
            new ApiError("All product images must be image files", 400)
          );
        }
      }
    }

    next();
  },

  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long")
    .isLength({ max: 2000 })
    .withMessage("Description must not exceed 2000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
  check("sold")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Sold must be a positive integer"),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number")
    .isLength({ max: 32 })
    .withMessage("Price must not exceed 32 characters"),
  check("priceAfterDiscount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price after discount must be a positive number")
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .isLength({ max: 32 })
    .withMessage("Price after discount must not exceed 32 characters")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Price after discount must be less than the original price"
        );
      }
      return true;
    }),
  check("colors").optional().isArray().withMessage("Colors must be an array"),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom((category) => {
      return categoryModel.findById(category).then((cat) => {
        if (!cat) {
          return Promise.reject(
            new Error(`Category with Id ${category} not found`)
          );
        }
      });
    }),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories must be an array")
    .custom((subCategoriesIds) => {
      return subCategoryModel
        .find({ _id: { $exists: true, $in: subCategoriesIds } })
        .then((result) => {
          if (result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        });
    })
    .custom((val, { req }) =>
      subCategoryModel
        .find({ category: req.body.category })
        .then((subCategories) => {
          const subCategoriesIds = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIds.push(subCategory._id.toString());
          });

          if (!val.every((v) => subCategoriesIds.includes(v))) {
            return Promise.reject(
              new Error(`subCategories not belong to category`)
            );
          }
        })
    ),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating average must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating average must be at least 1 character")
    .isLength({ max: 5 })
    .withMessage("Rating average must not exceed 5 characters"),
  check("ratingsQuantity")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Ratings quantity must be a positive integer"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
