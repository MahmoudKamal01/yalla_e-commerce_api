const express = require("express");

const router = express.Router();
const subCategoryRoute = require("./subCategoryRoute");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
  deleteCategoryImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const authService = require("../services/authService");

router.use("/:categoryId/sub-categories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    createCategoryValidator,
    resizeCategoryImage,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    updateCategoryValidator,
    resizeCategoryImage,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategoryImage,
    deleteCategory
  );
module.exports = router;
