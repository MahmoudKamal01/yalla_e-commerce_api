const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    return sendErrorForDev(err, res);
  } else {
    return sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  // Operational, trusted error: send message to client
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrorHandler;
