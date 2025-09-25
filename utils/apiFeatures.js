class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"]; // Added "keyword"
    excludesFields.forEach((field) => delete queryStringObj[field]);

    // Convert flattened query to nested object for patterns like sold[gt], price[lte]
    const convertedQuery = {};

    Object.keys(queryStringObj).forEach((key) => {
      const match = key.match(/^(.+)\[(.+)\]$/);
      if (match) {
        const [, field, operator] = match;
        if (!convertedQuery[field]) {
          convertedQuery[field] = {};
        }
        convertedQuery[field][operator] = queryStringObj[key];
      } else {
        convertedQuery[key] = queryStringObj[key];
      }
    });

    // Apply filtration using [gte, gt, lte, lt, eq, ne]
    let queryStr = JSON.stringify(convertedQuery);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq|ne)\b/g,
      (match) => `$${match}`
    );

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt"); // Fixed typo
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
