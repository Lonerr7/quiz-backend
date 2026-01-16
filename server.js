const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {isDev} = require('./helpers/utils/getEnvironment');

// handling Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION💥! SHUTTING DOWN...`);
  console.error(err);

  process.exit(1);
});

dotenv.config({path: './config.env'}); // конфигурация env должна быть ДО require app

const app = require('./app');

// Connecting to DB
const DB = isDev ? process.env.DATABASE_LOCAL : process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
// const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB, {autoIndex: true}).then((connection) => console.log('DB connection is successful')).catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});

console.log(process.env.NODE_ENV);

// handling Unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHADLED REJECTION💥!. Shutting down...');
  console.error(err);

  server.close(() => {
    process.exit(1);
  })
});

