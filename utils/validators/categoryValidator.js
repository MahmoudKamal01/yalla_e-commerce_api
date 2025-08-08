const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must not exceed 50 characters"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
];
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];
