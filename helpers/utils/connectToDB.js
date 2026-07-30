const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const isDev = process.env.NODE_ENV === 'development';
    const DB = isDev
      ? process.env.DATABASE_LOCAL
      : process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

    const opts = {
      bufferCommands: false, // Отключает буферизацию: Mongoose сразу выбросит ошибку, если нет сети, вместо ожидания 10 сек
    };

    cached.promise = mongoose.connect(DB, opts).then((mongoose) => {
      console.log('DB Connection successful');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectToDB;
