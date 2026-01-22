const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const {isDev} = require('./helpers/utils/getEnvironment');
const testRouter = require('./routes/testsRoutes');
const adminRouter = require('./routes/adminRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./helpers/classes/AppError');
const globalErrorHandler = require('./controllers/errorController');

const BASE_URL = '/api/v1';

const app = express();

// Global Middlewares
// 1. Set security HTTP Headers
app.use(helmet());

// 2. Development logging
if (isDev) {
  app.use(morgan('dev'));
} // логирование

// 3. Limit requests from the same IP
const limiter = rateLimit({
  limit: 100, // 100 requests max from the same IP in windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests. Try again in 1 hour',
});
app.use('/api', limiter);

// 4. Body-parser
app.use(express.json({limit: '10kb'})); // чтобы можно было достать тело POST запроса

// 5. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 6. Data sanitization against XSS
app.use(xss());

// 7. Preventing parameter pollution
app.use(hpp());

// Routes
app.use(`${BASE_URL}/tests`, testRouter);
app.use(`${BASE_URL}/admin/tests`, adminRouter);
app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/users`, userRouter);

// Wrong endpoint requests global handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on  this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;