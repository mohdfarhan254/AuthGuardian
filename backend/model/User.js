const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String }, // Used for both email verification and password reset
  verifyTokenExpiry: { type: Date }, // 🔥 Required for OTP expiration logic
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
