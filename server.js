const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');
const authRoute = require('./routes/authRoute');
const wishlistRoute = require('./routes/wishlistRoute');
const addressRoute = require('./routes/addressRoute');
const ApiError = require('./utils/apiError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('👩‍💻 Development mode is ON');
}

app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/sub-categories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/api/v1/addresses', addressRoute);
app.use('/api/v1/auth', authRoute);

app.get('/test', (_, res) => {
  res.send('Tests route is working!');
});

app.all('/{*any}', (req, res, next) => {
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
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.name, err.message);
  server.close(() => {
    console.error('Shutting down the server due to unhandled rejection');
    process.exit(1); // Exit process with failure
  });
});
