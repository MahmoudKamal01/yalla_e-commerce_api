class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "keyword",
      "minPrice",
      "maxPrice",
    ];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    const mongoQuery = {};
    const mongoose = require("mongoose");

    // Process each query parameter
    Object.keys(queryStringObj).forEach((key) => {
      // Skip special params handled separately
      if (key === "category" || key === "brand" || key === "color") {
        return;
      }

      // Handle operator syntax like price[gte], sold[lt]
      const match = key.match(/^(.+)\[(.+)\]$/);
      if (match) {
        const [, field, operator] = match;
        if (!mongoQuery[field]) {
          mongoQuery[field] = {};
        }
        // Add MongoDB operator with $ prefix
        mongoQuery[field][`$${operator}`] = queryStringObj[key];
      } else {
        mongoQuery[key] = queryStringObj[key];
      }
    });

    // Handle multiple categories
    if (queryStringObj.category) {
      let categoryIds = [];

      if (Array.isArray(queryStringObj.category)) {
        // If it's already an array (multiple category params like ?category=id1&category=id2)
        categoryIds = queryStringObj.category
          .map((v) => (typeof v === "string" ? v.trim() : v))
          .filter((v) => !!v && String(v).length > 0);
      } else if (typeof queryStringObj.category === "string") {
        // Single category
        const value = queryStringObj.category.trim();
        if (value.length > 0) {
          categoryIds = [value];
        }
      }

      // Convert to ObjectId and apply category filter
      if (categoryIds.length > 1) {
        const objectIds = categoryIds.map((id) => {
          return mongoose.Types.ObjectId.isValid(id)
            ? new mongoose.Types.ObjectId(id)
            : id;
        });
        mongoQuery.category = { $in: objectIds };
      } else if (categoryIds.length === 1) {
        const id = categoryIds[0];
        mongoQuery.category = mongoose.Types.ObjectId.isValid(id)
          ? new mongoose.Types.ObjectId(id)
          : id;
      }
    }

    // Handle price range
    const minPrice = this.queryString.minPrice;
    const maxPrice = this.queryString.maxPrice;

    if (minPrice !== undefined || maxPrice !== undefined) {
      if (!mongoQuery.price) mongoQuery.price = {};

      if (minPrice !== undefined && minPrice !== "") {
        const parsedMin = Number(minPrice);
        if (!isNaN(parsedMin)) {
          mongoQuery.price.$gte = parsedMin;
        }
      }

      if (maxPrice !== undefined && maxPrice !== "") {
        const parsedMax = Number(maxPrice);
        if (!isNaN(parsedMax)) {
          mongoQuery.price.$lte = parsedMax;
        }
      }
    }

    // Handle multiple brands (IDs), supports comma-separated or repeated params
    if (this.queryString.brand) {
      let brandValues = [];
      if (Array.isArray(this.queryString.brand)) {
        brandValues = this.queryString.brand;
      } else if (typeof this.queryString.brand === "string") {
        const trimmed = this.queryString.brand.trim();
        if (trimmed.includes(",")) {
          brandValues = trimmed.split(",").map((v) => v.trim());
        } else if (trimmed.length > 0) {
          brandValues = [trimmed];
        }
      }
      if (brandValues.length > 0) {
        const normalized = brandValues.map((v) =>
          mongoose.Types.ObjectId.isValid(v)
            ? new mongoose.Types.ObjectId(v)
            : v
        );
        mongoQuery.brand =
          normalized.length > 1 ? { $in: normalized } : normalized[0];
      }
    }

    // Handle color filter; supports single or comma-separated values, matches array field
    if (this.queryString.color) {
      let colorValues = [];
      if (Array.isArray(this.queryString.color)) {
        colorValues = this.queryString.color;
      } else if (typeof this.queryString.color === "string") {
        const trimmed = this.queryString.color.trim();
        if (trimmed.includes(",")) {
          colorValues = trimmed
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
        } else if (trimmed.length > 0) {
          colorValues = [trimmed];
        }
      }
      if (colorValues.length > 0) {
        mongoQuery.colors =
          colorValues.length > 1 ? { $in: colorValues } : colorValues[0];
      }
    }

    this.mongooseQuery = this.mongooseQuery.find(mongoQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let searchQuery = {};

      if (modelName === "Products") {
        searchQuery = {
          $or: [
            { title: { $regex: this.queryString.keyword, $options: "i" } },
            {
              description: { $regex: this.queryString.keyword, $options: "i" },
            },
          ],
        };
      } else {
        searchQuery = {
          name: { $regex: this.queryString.keyword, $options: "i" },
        };
      }

      // Get existing conditions from the current query
      const existingConditions = this.mongooseQuery.getQuery();

      // If there are existing conditions, combine with $and
      if (Object.keys(existingConditions).length > 0) {
        const combinedQuery = {
          $and: [existingConditions, searchQuery],
        };
        // Reset the query with combined conditions
        this.mongooseQuery = this.mongooseQuery.model.find(combinedQuery);
      } else {
        // No existing conditions, just apply search
        this.mongooseQuery = this.mongooseQuery.find(searchQuery);
      }
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    // previous page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
