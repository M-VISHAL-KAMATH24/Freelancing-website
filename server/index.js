// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const sellerAuthRoutes = require('./routes/sellerAuth.js');
// const sellerServiceRoutes = require('./routes/sellerService.js');
// const authRoutes = require('./routes/auth.js');
// const path = require('path');
// const User = require('./models/User'); // Ensure User model is imported
// const jwt = require('jsonwebtoken');

// dotenv.config({ path: '../.env' });

// const app = express();

// // Connect to MongoDB
// const startServer = async () => {
//   try {
//     await connectDB();
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('Failed to connect to MongoDB:', error.message);
//     process.exit(1);
//   }
// };
// startServer();

// // Middleware
// app.use(express.json());
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/seller/auth', sellerAuthRoutes);
// app.use('/api/seller/service', sellerServiceRoutes);
// app.use('/api/auth', authRoutes);

// // Profile Endpoint for Users
// app.get('/api/auth/profile', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     const user = await User.findById(decoded.id).select('-password'); // Exclude password
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// });

// // Health Check
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Freelance Marketplace API is running' });
// });

// // Error Handling for Uncaught Exceptions
// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error.message);
//   process.exit(1);
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const sellerAuthRoutes = require('./routes/sellerAuth.js');
const sellerServiceRoutes = require('./routes/sellerService.js');
const authRoutes = require('./routes/auth.js');
const path = require('path');
const User = require('./models/User'); // Ensure User model is imported
const jwt = require('jsonwebtoken');

dotenv.config({ path: '../.env' });

const app = express();

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
startServer();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://your-frontend.onrender.com', credentials: true })); // Update with actual frontend URL after deployment
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/seller/auth', sellerAuthRoutes);
app.use('/api/seller/service', sellerServiceRoutes);
app.use('/api/auth', authRoutes);

// Profile Endpoint for Users
app.get('/api/auth/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Freelance Marketplace API is running' });
});

// Error Handling for Uncaught Exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});