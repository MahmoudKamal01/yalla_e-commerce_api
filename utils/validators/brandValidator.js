const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must not exceed 50 characters"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
];
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];
