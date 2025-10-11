const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference (one to many)
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.profileImg) {
    // Check if profileImg is already a full URL
    if (
      doc.profileImg.startsWith("http://") ||
      doc.profileImg.startsWith("https://")
    ) {
      // Extract filename from URL if it's a localhost/production URL
      if (doc.profileImg.includes("/users/")) {
        const filename = doc.profileImg.split("/users/").pop();
        // Only process if it's not an external URL
        if (!filename.startsWith("http")) {
          doc.profileImg = `${process.env.BASE_URL}/users/${filename}`;
        } else {
          // External URL embedded, keep the external URL
          doc.profileImg = filename;
        }
      }
      // else: keep external URL as is
    } else {
      // It's just a filename, construct full URL
      const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
      doc.profileImg = imageUrl;
    }
  }
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// findOne, findAll, Update
userSchema.post("init", function (doc) {
  setImageUrl(doc);
});

// add
userSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
