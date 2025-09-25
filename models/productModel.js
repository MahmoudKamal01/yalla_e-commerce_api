const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Too short product title"],
      maxLength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },
    colors: {
      type: [String],
      required: [true, "Product colors are required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [20, "Too short product description"],
    },
    imageCover: {
      type: String,
      required: [true, "Product cover image is required"],
    },
    images: {
      type: [String],
      required: [true, "Product images are required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, "Product subcategory is required"],
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must be at most 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" })
    .populate({ path: "subCategories", select: "name" })
    .populate({ path: "brand", select: "name" });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    doc.images = doc.images.map((img) => {
      return `${process.env.BASE_URL}/products/${img}`;
    });
  }
};

// findOne, findAll, Update
productSchema.post("init", function (doc) {
  setImageUrl(doc);
});

// add
productSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
