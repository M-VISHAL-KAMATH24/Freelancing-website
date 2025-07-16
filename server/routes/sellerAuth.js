const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller.js');
const authenticateSeller = require('./auth.js');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Seller signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields (email, password, name) are required' });
    }
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = new Seller({ email, password: hashedPassword, name });
    await seller.save();
    res.status(201).json({ message: 'Seller registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seller login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: seller._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get seller profile
router.get('/profile', authenticateSeller, async (req, res) => {
  try {
    console.log('Fetching profile for seller ID:', req.seller.id); // Debug log
    const seller = await Seller.findById(req.seller.id).select('-password');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update seller profile
router.put('/profile', authenticateSeller, upload.single('image'), async (req, res) => {
  try {
    const { name, experience, place, averagePrice, services } = req.body;
    if (!name && !experience && !place && !averagePrice && !services && !req.file) {
      return res.status(400).json({ message: 'No updates provided' });
    }
    const updateData = {
      name,
      experience: experience ? Number(experience) : undefined,
      place,
      averagePrice: averagePrice ? Number(averagePrice) : undefined,
      services: services ? (Array.isArray(services) ? services : JSON.parse(services)) : undefined,
    };
    if (req.file) updateData.image = req.file.filename;
    const seller = await Seller.findByIdAndUpdate(req.seller.id, updateData, { new: true, runValidators: true });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json({ message: 'Profile updated', seller });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;