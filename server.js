const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./middlewares/errorMiddleware");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("👩‍💻 Development mode is ON");
}

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/sub-categories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);

app.get("/test", (_, res) => {
  res.send("Tests route is working!");
});

app.all("/{*any}", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/* Error handling middleware */
app.use(globalErrorHandler);

/* start server */
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`✔ 🎉Server is running on port ${PORT}`);
});

const startServer = async () => {
  await dbConnection();
  server;
};

startServer();

//handling rejection errors outside express
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.name, err.message);
  server.close(() => {
    console.error("Shutting down the server due to unhandled rejection");
    process.exit(1); // Exit process with failure
  });
});
