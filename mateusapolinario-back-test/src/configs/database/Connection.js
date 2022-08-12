const mongoose = require('mongoose');

async function dbConnect() {
  try {
    const DB_NAME = 'Cookmaster';
    const MONGO_DB_URL = `mongodb://${process.env.HOST || 'mongodb'}:27017/${DB_NAME}`;
    return await mongoose.connect(MONGO_DB_URL);
  } catch (err) {
    return null;
  }
}

module.exports = { dbConnect };