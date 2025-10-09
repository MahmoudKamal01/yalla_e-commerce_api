const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes");
const { swaggerUi, specs } = require("./config/swagger");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      return callback(null, true); // reflect the origin back
    },
    credentials: true, // ✅ allow cookies/authorization headers
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("👩‍💻 Development mode is ON");
}

// Swagger Documentation
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Yalla E-commerce API Documentation",
  })
);

// Mount Routes
mountRoutes(app);

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
