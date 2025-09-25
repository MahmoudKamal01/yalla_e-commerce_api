const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images are allowed!", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMultipleImages = (arrayOfFields) => {
  return multerOptions().fields(arrayOfFields);
};
