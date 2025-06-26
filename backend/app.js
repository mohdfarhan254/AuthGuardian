require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ Import cors
const connectDB = require('./config/db');

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // your React app URL
  credentials: true               // if you use cookies
}));

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// ✅ Unified auth route
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('✅ AuthGuardian API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
