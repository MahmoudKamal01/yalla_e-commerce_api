const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [50, "Category name must not exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    // Check if image is already a full URL
    if (doc.image.startsWith("http://") || doc.image.startsWith("https://")) {
      // Extract filename from URL if it's a localhost URL
      if (doc.image.includes("/categories/")) {
        const filename = doc.image.split("/categories/").pop();
        // Only process if it's not an external URL
        if (!filename.startsWith("http")) {
          doc.image = `${process.env.BASE_URL}/categories/${filename}`;
        } else {
          // External URL embedded, keep the external URL
          doc.image = filename;
        }
      }
      // else: keep external URL as is
    } else {
      // It's just a filename, construct full URL
      const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
      doc.image = imageUrl;
    }
  }
};

// findOne, findAll, Update
categorySchema.post("init", function (doc) {
  setImageUrl(doc);
});

// add
categorySchema.post("save", function (doc) {
  setImageUrl(doc);
});

module.exports = mongoose.model("Category", categorySchema);
