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
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
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
