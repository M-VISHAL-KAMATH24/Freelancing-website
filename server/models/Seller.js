const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  experience: { type: Number },
  place: { type: String },
  averagePrice: { type: Number },
  services: [{ type: String }],
  image: { type: String }
});

module.exports = mongoose.model('Seller', sellerSchema);