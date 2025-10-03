const express = require("express");

const router = express.Router();
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
  deleteBrandImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const authService = require("../services/authService");

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    createBrandValidator,
    resizeBrandImage,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    updateBrandValidator,
    resizeBrandImage,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteBrandValidator,
    deleteBrandImage,
    deleteBrand
  );
module.exports = router;
