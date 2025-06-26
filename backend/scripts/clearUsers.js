require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const clearUsers = async () => {
  await connectDB();
  await User.deleteMany({});
  console.log('✅ All users deleted');
  process.exit();
};

clearUsers();
