const mongoose = require('mongoose');
require('../config/db'); // Adjusted path

const serviceSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }
});

module.exports = mongoose.model('Service', serviceSchema);