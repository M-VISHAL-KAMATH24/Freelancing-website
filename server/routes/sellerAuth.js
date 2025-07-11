const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = new Seller({ name, email, password: hashedPassword });
    await seller.save();
    res.status(201).json({ message: 'Seller created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email });
    if (!seller || !(await bcrypt.compare(password, seller.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', seller });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;