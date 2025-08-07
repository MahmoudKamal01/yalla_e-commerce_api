const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("👩‍💻 Development mode is ON");
}

app.use("/api/v1/categories", categoryRoute);

app.get("/test", (_, res) => {
  res.send("Tests route is working!");
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await dbConnection();
  app.listen(PORT, () => {
    console.log(`✔ 🎉Server is running on port ${PORT}`);
  });
};

startServer();
