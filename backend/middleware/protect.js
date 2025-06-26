const jwt = require('jsonwebtoken');

// 🔐 Middleware to protect private routes
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🚫 No token provided
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // Proceed to the route
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;
