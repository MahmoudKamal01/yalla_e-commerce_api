const fs = require("fs");
const path = require("path");

/**
 * Middleware factory for deleting an image file before updating/deleting a doc
 * @param {Object} options
 * @param {MongooseModel} options.model - Mongoose model (e.g., Category, Brand)
 * @param {String} options.folder - Upload folder path relative to /uploads (e.g., "categories", "brands")
 * @param {String} [options.field="image"] - The field name in the document that holds the image filename
 */
exports.deleteImageMiddleware = ({ model, folder, field = "image" }) => {
  return async (req, res, next) => {
    try {
      const doc = await model.findById(req.params.id);
      if (!doc) {
        return res
          .status(404)
          .json({ message: `${model.modelName} not found` });
      }

      if (doc[field]) {
        const imagePath = path.join(
          __dirname,
          `../uploads/${folder}/${doc[field]}`
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
      }

      next();
    } catch (err) {
      console.error("Error in deleteImageMiddleware:", err);
      next(err);
    }
  };
};
