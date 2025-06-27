require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ Import cors
const connectDB = require('./config/db');

const app = express();

// ✅ Enable CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5001'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// ✅ Unified auth route
app.use('/api/auth', require('./controller/AuthController'));

// Health check
app.get('/', (req, res) => {
  res.send('✅ AuthGuardian API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
