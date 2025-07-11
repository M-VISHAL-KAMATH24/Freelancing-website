const express = require('express');
  const dotenv = require('dotenv');
  const connectDB = require('./config/db');
  const authRoutes = require('./routes/auth');
  const cors = require('cors');
  const sellerAuthRoutes = require('./routes/sellerAuth');

  dotenv.config({ path: '../.env' });

  const app = express();

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(express.json());
  app.use(cors({ origin: 'http://localhost:5173' })); 
  
  // Allow requests from frontend
  // Add near the existing app.use statements

app.use('/api/seller/auth', sellerAuthRoutes);

  // Routes
  app.use('/api/auth', authRoutes);

  app.get('/', (req, res) => {
    res.send('Freelance Marketplace API is running');
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });