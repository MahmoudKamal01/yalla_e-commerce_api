const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory name is required"],
      unique: [true, "SubCategory name must be unique"],
      minlength: [3, "SubCategory name must be at least 3 characters long"],
      maxlength: [50, "SubCategory name must not exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a Category"],
    },
    image: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("SubCategory", subCategorySchema);
