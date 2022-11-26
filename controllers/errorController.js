const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stackss,
  });
};

const sendErrorProd = (err, res) => {
  //1.Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //1.log error
    console.log("Error", err);

    //2.send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handleJWTError = () =>
  new AppError("Invalid token, Please log in again", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired!! Please login again", 401);

module.exports = (err, req, res, next) => {
  //error statusCode
  err.statusCode = err.statusCode || 500; //500--->internal error
  //error status
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...error };

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpireError") error = handleJWTExpiredError();

    sendErrorProd(err, res);
  }
};
