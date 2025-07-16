const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authenticateSeller = require('../middlewares/authenticateSeller');
const multer = require('multer');
const path = require('path');

// Multer setup
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
    const { name, type, price } = req.body;
    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Missing required fields: name, type, price' });
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
    res.status(500).json({ message: 'Error adding service', error: error.message });
  }
});

// Get all services for logged-in seller
router.get('/services', authenticateSeller, async (req, res) => {
  try {
    const services = await Service.find({ sellerId: req.seller.id });
    res.json(services);
  } catch (error) {
    console.error('Service fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service
router.put('/services/:id', authenticateSeller, upload.single('image'), async (req, res) => {
  try {
    const { name, type, price } = req.body;
    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Missing required fields: name, type, price' });
    }
    const updateData = {
      name,
      type,
      price: Number(price),
      ...(req.file && { image: req.file.filename }),
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
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Delete service
router.delete('/services/:id', authenticateSeller, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, sellerId: req.seller.id });
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Service delete error:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

module.exports = { router };
