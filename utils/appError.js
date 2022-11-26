class AppError extends Error {
  constructor(message, statuscode) {
    super(message);

    this.statuscode = statuscode;
    this.status = `${this.statuscode}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
