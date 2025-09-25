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

router.use("/:categoryId/sub-categories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    createCategoryValidator,
    resizeCategoryImage,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    updateCategoryValidator,
    resizeCategoryImage,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategoryImage, deleteCategory);
module.exports = router;
