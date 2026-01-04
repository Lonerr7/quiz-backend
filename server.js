const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // конфигурация env должна быть ДО require app

const app = require('./app');

// Connecting to DB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(DB).then((connection) => {
  console.log(connection.connections);
  console.log('DB connection is successful');
}).catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});

console.log(process.env.NODE_ENV);