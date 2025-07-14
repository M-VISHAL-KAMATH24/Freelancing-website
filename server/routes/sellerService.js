const express = require('express');
const router = express.Router();
const Service = require('../models/Service.js');
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

// Add service
router.post('/services', authenticateSeller, upload.single('image'), async (req, res) => {
  try {
    console.log('Received service data:', req.body, 'File:', req.file);
    const { name, type, price } = req.body;
    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Missing required fields: name, type, and price are required' });
    }
    const service = new Service({
      sellerId: req.seller.id,
      name,
      type,
      price: Number(price),
      image: req.file ? req.file.filename : null,
    });
    await service.save();
    res.status(201).json({ message: 'Service added successfully' });
  } catch (error) {
    console.error('Service add error:', error);
    res.status(500).json({ message: 'Error adding service', error: error.message || 'Unknown error' });
  }
});

// Get services
router.get('/services', authenticateSeller, async (req, res) => {
  try {
    console.log('Fetching services for sellerId:', req.seller.id); // Debug log
    const services = await Service.find({ sellerId: req.seller.id });
    console.log('Fetched services:', services); // Debug log
    res.json(services);
  } catch (error) {
    console.error('Service fetch error:', error); // Debug log
    res.status(500).json({ message: 'Server error', error: error.message || 'Unknown error' });
  }
});

module.exports = router;