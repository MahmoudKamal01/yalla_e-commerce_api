const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must not exceed 50 characters"),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
];
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory ID format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory ID format"),
  validatorMiddleware,
];
