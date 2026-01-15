const {isDev, isProd} = require('../helpers/utils/getEnvironment');
const AppError = require('../helpers/classes/AppError');

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

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

module.exports = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (isDev) {
    sendDevError(err, res);
  } else if (isProd) {
    let error = Object.create(err);

    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }

    sendProdError(error, res);
  }
};