const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const sendMail = require('../utils/EmailService');

// ✅ Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verifyToken: otp,
    });

    await newUser.save();

    await sendMail(
      email,
      'Verify Your Email',
      `<h2>Welcome, ${name}!</h2><p>Your OTP is: <b>${otp}</b></p><p>It expires in 10 minutes.</p>`
    );

    res.status(201).json({ message: 'User registered. OTP sent to email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Verify Email
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.verifyToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Protected Route (for dashboard fetch)
exports.getProtectedData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Request Password Reset (Send OTP with expiry)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;

    user.verifyToken = otp;
    user.verifyTokenExpiry = expiry;
    await user.save();

    await sendMail(
      email,
      'Your OTP for Password Reset',
      `<h2>Hello, ${user.name}!</h2>
       <p>Your OTP to reset password is: <b>${otp}</b></p>
       <p>It expires in 10 minutes.</p>`
    );

    res.json({ message: 'OTP sent to your email for password reset' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Reset Password using OTP with expiry check
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (
      user.verifyToken !== otp ||
      !user.verifyTokenExpiry ||
      Date.now() > user.verifyTokenExpiry
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
