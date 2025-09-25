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

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, createBrandValidator, resizeBrandImage, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, updateBrandValidator, resizeBrandImage, updateBrand)
  .delete(deleteBrandValidator, deleteBrandImage, deleteBrand);
module.exports = router;
