const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  getProtectedData,
  requestPasswordReset,
  resetPassword,
} = require('../service/AuthService');

const protect = require('../middleware/AuthMiddleware'); // For protected routes

// 🔐 Auth Routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/protected', protect, getProtectedData);

// 🔁 Password Reset Routes
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
