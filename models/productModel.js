const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    // Check if imageCover is already a full URL
    if (
      doc.imageCover.startsWith("http://") ||
      doc.imageCover.startsWith("https://")
    ) {
      // Extract filename from URL if it's a localhost URL, otherwise keep as is
      if (doc.imageCover.includes("/products/")) {
        const filename = doc.imageCover.split("/products/").pop();
        // Only process if it's not an external URL (fakestoreapi, etc)
        if (!filename.startsWith("http")) {
          doc.imageCover = `${process.env.BASE_URL}/products/${filename}`;
        } else {
          // External URL embedded, keep the external URL
          doc.imageCover = filename;
        }
      }
      // else: keep external URL as is
    } else {
      // It's just a filename, construct full URL
      const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
      doc.imageCover = imageUrl;
    }
  }
  if (doc.images && doc.images.length > 0) {
    const imagesList = [];
    doc.images.forEach((image) => {
      // Check if image is already a full URL
      if (image.startsWith("http://") || image.startsWith("https://")) {
        // Extract filename from URL if it's a localhost URL
        if (image.includes("/products/")) {
          const filename = image.split("/products/").pop();
          // Only process if it's not an external URL
          if (!filename.startsWith("http")) {
            imagesList.push(`${process.env.BASE_URL}/products/${filename}`);
          } else {
            // External URL embedded, keep the external URL
            imagesList.push(filename);
          }
        } else {
          // External URL, keep as is
          imagesList.push(image);
        }
      } else {
        // It's just a filename, construct full URL
        const imageUrl = `${process.env.BASE_URL}/products/${image}`;
        imagesList.push(imageUrl);
      }
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
