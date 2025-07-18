require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const Seller = require('./models/Seller');
const Service = require('./models/Service');

// Import routes
const sellerAuthRoutes = require('./routes/sellerAuth');
const sellerServiceRoutes = require('./routes/sellerService');
const authRoutes = require('./routes/auth');

const app = express();

// Log the MONGO_URI to confirm it's loaded
console.log('MONGO_URI:', process.env.MONGO_URI);

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // CORS setup with enhanced logging
    const allowedOrigins = [
      'https://freelancing-website-122.onrender.com',
      'http://localhost:5173',
    ];
    app.use(cors({
      origin: function (origin, callback) {
        console.log('🔍 CORS Origin Check:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
          console.log('✅ CORS Allowed for:', origin || 'No origin');
          callback(null, true);
        } else {
          console.log('❌ CORS Blocked for:', origin);
          callback(new Error('Not allowed by CORS: ' + origin));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200, // Some legacy browsers
    }));

    // Middleware
    app.use(express.json());
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Routes
    app.use('/api/seller/auth', sellerAuthRoutes);
    app.use('/api/seller/service', sellerServiceRoutes.router);
    app.use('/api/auth', authRoutes.router);

    // User Profile Route
    app.get('/api/auth/profile', async (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token required' });

      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
      } catch (error) {
        console.error('User profile fetch error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    });

    // Seller Profile Route
    app.get('/api/seller/auth/profile', async (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token required' });

      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const seller = await Seller.findById(decoded.id).select('-password');
        if (!seller) return res.status(404).json({ message: 'Seller not found' });
        res.json(seller);
      } catch (error) {
        console.error('Seller profile fetch error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    });

    // Updated Endpoint to Fetch All Services (Public)
    app.get('/api/seller/service', async (req, res) => {
      try {
        const services = await Service.find().select('name type price sellerId image');
        if (!services.length) {
          return res.status(404).json({ message: 'No services found' });
        }
        res.json(services);
      } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Server error fetching services' });
      }
    });

    // Start listening
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();