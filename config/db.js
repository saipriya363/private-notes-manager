// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('MONGO_URI not defined in .env');
  }

  try {
    await mongoose.connect(mongoURI, {
      // options not needed for mongoose 7+
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err; // propagate to server.js
  }
};

module.exports = connectDB;

