const express = require('express');
const morgan = require('morgan');
const {isDev} = require('./helpers/utils/getEnvironment');
const testRouter = require('./routes/testsRoutes');
const adminRouter = require('./routes/adminRoutes');
const AppError = require('./helpers/classes/AppError');
const globalErrorHandler = require('./controllers/errorController');

const BASE_URL = '/api/v1';

const app = express();

// Middlewares
if (isDev) {
  app.use(morgan('dev'));
} // логирование

app.use(express.json()); // чтобы можно было достать тело POST запроса

// Routes

app.use(`${BASE_URL}/tests`, testRouter);
app.use(`${BASE_URL}/admin/tests`, adminRouter);

// Wrong endpoint requests global handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on  this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;