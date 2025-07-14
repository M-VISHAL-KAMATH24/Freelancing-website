const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const sellerAuthRoutes = require('./routes/sellerAuth.js');
const sellerServiceRoutes = require('./routes/sellerService.js');
const path = require('path');

dotenv.config({ path: '../.env' });

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/seller/auth', sellerAuthRoutes);
app.use('/api/seller/service', sellerServiceRoutes);

app.get('/', (req, res) => {
  res.send('Freelance Marketplace API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});