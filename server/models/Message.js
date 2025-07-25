const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverModel' },
  senderModel: { type: String, required: true, enum: ['User', 'Seller'] },
  receiverModel: { type: String, required: true, enum: ['User', 'Seller'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);