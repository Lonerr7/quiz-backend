const express = require('express');
const morgan = require('morgan');
const {isDev} = require('./helpers/utils/isDev');

const BASE_URL = '/api/v1';

const app = express();

// Middlewares
if (isDev()) {
  app.use(morgan('dev'));
} // логирование

app.use(express.json()); // чтобы можно было достать тело POST запроса

// Routes
const testRouter = require('./routes/testsRoutes');
app.use(`${BASE_URL}/tests`, testRouter);

const adminRouter = require('./routes/adminRoutes');
app.use(`${BASE_URL}/admin/tests`, adminRouter);

module.exports = app;