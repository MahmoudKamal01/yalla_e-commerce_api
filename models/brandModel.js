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

const setImageUrl = (doc) => {
  if (doc.image) {
    // Check if image is already a full URL
    if (doc.image.startsWith("http://") || doc.image.startsWith("https://")) {
      // Extract filename from URL if it's a localhost/production URL
      if (
        doc.image.includes("/brands/") ||
        doc.image.includes("/categories/")
      ) {
        const parts = doc.image.split(/\/(brands|categories)\//);
        const filename = parts[parts.length - 1];
        // Only process if it's not an external URL
        if (!filename.startsWith("http")) {
          doc.image = `${process.env.BASE_URL}/brands/${filename}`;
        } else {
          // External URL embedded, keep the external URL
          doc.image = filename;
        }
      }
      // else: keep external URL as is
    } else {
      // It's just a filename, construct full URL
      const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
      doc.image = imageUrl;
    }
  }
};

// findOne, findAll, Update
brandSchema.post("init", function (doc) {
  setImageUrl(doc);
});

// add
brandSchema.post("save", function (doc) {
  setImageUrl(doc);
});

module.exports = mongoose.model("Brand", brandSchema);
