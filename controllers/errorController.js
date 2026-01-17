const {isDev, isProd} = require('../helpers/utils/getEnvironment');
const AppError = require('../helpers/classes/AppError');

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFiedlsDB = (err) => {
  const value = Object.values(err.keyValue).join(', ');
  return new AppError(`Duplicate field value: ${value}. Please use another one!`, 400);
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((errObj) => errObj.message).join('. ');
  const message = `Invalid input data. ${errors}.`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () => new AppError('Expired token. Please log in again', 401);

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
}

const sendProdError = (err, res) => {
  // Operational, trusted error: sending message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  // Programming or other unknown errors: don't send to client
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong! Try again later.',
  });
  console.error('Unoperational Error: ', err);
}

// наличие next в аргументах ф-ции обязательно!
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (isDev) {
    sendDevError(err, res);
  } else if (isProd) {
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFiedlsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendProdError(error, res);
  }

};