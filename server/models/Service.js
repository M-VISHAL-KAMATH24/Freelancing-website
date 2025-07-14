const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Service', serviceSchema);