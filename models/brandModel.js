const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [3, "Brand name must be at least 3 characters long"],
      maxlength: [50, "Brand name must not exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Brand", brandSchema);
