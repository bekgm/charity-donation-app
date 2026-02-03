const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const donationRoutes = require('./routes/donationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('frontend'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
