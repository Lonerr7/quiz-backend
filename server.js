const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // конфигурация env должна быть ДО require app

const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});

console.log(process.env.NODE_ENV);