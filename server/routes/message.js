const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and determine user or seller
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
      req.userType = 'user';
      return next();
    }
    const seller = await Seller.findById(decoded.id).select('-password');
    if (seller) {
      req.seller = seller;
      req.userType = 'seller';
      return next();
    }
    res.status(404).json({ message: 'User or Seller not found' });
  } catch (error) {
    console.error('Authentication error:', error.message, error.stack);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Get messages between a user and a seller
router.get('/conversation/:otherId', authenticate, async (req, res) => {
  try {
    const userId = req.userType === 'user' ? req.user._id : req.seller._id;
    const otherId = req.params.otherId;
    console.log('Fetching conversation:', { userId, otherId });
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
      senderModel: { $in: ['User', 'Seller'] },
      receiverModel: { $in: ['User', 'Seller'] },
    })
      .populate({
        path: 'senderId',
        select: 'name',
        match: { _id: { $exists: true } },
      })
      .populate({
        path: 'receiverId',
        select: 'name',
        match: { _id: { $exists: true } },
      })
      .sort({ timestamp: 1 });
    const validMessages = messages.filter(msg => msg.senderId && msg.receiverId);
    console.log('Conversation messages:', validMessages.length, validMessages.map(m => m._id));
    res.json(validMessages);
  } catch (error) {
    console.error('Error fetching messages:', error.message, error.stack);
    res.status(500).json({ message: 'Server error fetching messages', error: error.message });
  }
});

// Get all conversations for a seller or user
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.userType === 'user' ? req.user._id : req.seller._id;
    console.log('Fetching conversations for:', { userId });
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate({
        path: 'senderId',
        select: 'name',
        match: { _id: { $exists: true } },
      })
      .populate({
        path: 'receiverId',
        select: 'name',
        match: { _id: { $exists: true } },
      })
      .sort({ timestamp: -1 });

    console.log('Found messages:', messages.length, messages.map(m => ({ id: m._id, senderId: m.senderId, receiverId: m.receiverId })));
    if (!messages.length) {
      return res.json([]);
    }

    const conversations = {};
    messages.forEach((msg) => {
      if (!msg.senderId || !msg.receiverId) return; // Skip invalid messages
      const otherId =
        msg.senderId._id.toString() === userId.toString()
          ? msg.receiverId._id.toString()
          : msg.senderId._id.toString();
      if (!conversations[otherId]) {
        conversations[otherId] = {
          userId: otherId,
          userName:
            msg.senderId._id.toString() === userId.toString()
              ? msg.receiverId.name || 'Unknown'
              : msg.senderId.name || 'Unknown',
          lastMessage: msg.content,
          timestamp: msg.timestamp,
        };
      }
    });
    const conversationList = Object.values(conversations);
    console.log('Returning conversations:', conversationList.length, conversationList);
    res.json(conversationList);
  } catch (error) {
    console.error('Error fetching conversations:', error.message, error.stack);
    res.status(500).json({ message: 'Server error fetching conversations', error: error.message });
  }
});

module.exports = router;