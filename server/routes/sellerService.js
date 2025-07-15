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
    console.log('Fetching services for sellerId:', req.seller.id);
    const services = await Service.find({ sellerId: req.seller.id });
    console.log('Fetched services:', services);
    res.json(services);
  } catch (error) {
    console.error('Service fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message || 'Unknown error' });
  }
});

// Update service
router.put('/services/:id', authenticateSeller, upload.single('image'), async (req, res) => {
  try {
    console.log('Received update data for service ID:', req.params.id, 'Data:', req.body, 'File:', req.file);
    const { name, type, price } = req.body;
    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Missing required fields: name, type, and price are required' });
    }
    const updateData = {
      name,
      type,
      price: Number(price),
      image: req.file ? req.file.filename : undefined,
    };
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.seller.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message || 'Unknown error' });
  }
});

// Delete service
router.delete('/services/:id', authenticateSeller, async (req, res) => {
  try {
    console.log('Deleting service with ID:', req.params.id);
    const service = await Service.findOneAndDelete({ _id: req.params.id, sellerId: req.seller.id });
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Service delete error:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message || 'Unknown error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const services = await Service.find(); // Fetch all services from the database
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services' });
  }
});

module.exports = router;