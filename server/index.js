require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const Seller = require('./models/Seller');
const Service = require('./models/Service');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

// Import routes
const sellerAuthRoutes = require('./routes/sellerAuth');
const sellerServiceRoutes = require('./routes/sellerService');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://freelancing-website-122.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Log the MONGO_URI to confirm it's loaded
console.log('MONGO_URI:', process.env.MONGO_URI);

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // CORS setup with enhanced logging
    const allowedOrigins = [
      'https://freelancing-website-122.onrender.com',
      'http://localhost:5173',
    ];
    app.use(cors({
      origin: function (origin, callback) {
        console.log('🔍 CORS Origin Check:', origin);
        if (!origin || allowedOrigins.includes(origin)) {
          console.log('✅ CORS Allowed for:', origin || 'No origin');
          callback(null, true);
        } else {
          console.log('❌ CORS Blocked for:', origin);
          callback(new Error('Not allowed by CORS: ' + origin));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
    }));

    // Middleware
    app.use(express.json());
    app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

    // Routes
    app.use('/api/seller/auth', sellerAuthRoutes);
    app.use('/api/seller/service', sellerServiceRoutes.router);
    app.use('/api/auth', authRoutes.router);
    app.use('/api/message', messageRoutes);

    // User Profile Route
    app.get('/api/auth/profile', async (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token required' });

      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
      } catch (error) {
        console.error('User profile fetch error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    });

    // Seller Profile Route (Authenticated)
    app.get('/api/seller/auth/profile', async (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token required' });

      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const seller = await Seller.findById(decoded.id).select('-password');
        if (!seller) return res.status(404).json({ message: 'Seller not found' });
        res.json(seller);
      } catch (error) {
        console.error('Seller profile fetch error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
      }
    });

    // Public Seller Profile by ID
    app.get('/api/seller/auth/profile/:sellerId', async (req, res) => {
      try {
        const seller = await Seller.findById(req.params.sellerId).select('-password');
        if (!seller) return res.status(404).json({ message: 'Seller not found' });
        res.json(seller);
      } catch (error) {
        console.error('Seller profile fetch error:', error);
        res.status(500).json({ message: 'Server error fetching seller profile' });
      }
    });

    // Fetch All Services (Public)
    app.get('/api/seller/service', async (req, res) => {
      try {
        const services = await Service.find().select('name type price sellerId image');
        if (!services.length) {
          return res.status(404).json({ message: 'No services found' });
        }
        res.json(services);
      } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Server error fetching services' });
      }
    });

    // Socket.IO for real-time chat
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Authenticate socket connection
      const token = socket.handshake.auth.token;
      let userId, userType;
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
          userType = decoded.role; // Assuming JWT includes role: 'user' or 'seller'
          console.log('Socket authenticated:', { userId, userType });
        } catch (error) {
          console.error('Socket authentication error:', error.message, error.stack);
          socket.disconnect();
          return;
        }
      } else {
        console.error('No token provided for socket connection');
        socket.disconnect();
        return;
      }

      // Join a room based on userId and sellerId
      socket.on('joinChat', ({ userId: clientUserId, sellerId }) => {
        if (clientUserId !== userId) {
          console.error('Unauthorized room join attempt:', { clientUserId, userId });
          return;
        }
        const room = [userId, sellerId].sort().join('-');
        socket.join(room);
        console.log(`User ${userId} joined room ${room}`);
      });

      // Handle sending a message
      socket.on('sendMessage', async ({ senderId, receiverId, content, senderModel, receiverModel }) => {
        if (senderId !== userId) {
          console.error('Unauthorized message send attempt:', { senderId, userId });
          return;
        }
        try {
          console.log('Received sendMessage:', { senderId, receiverId, content, senderModel, receiverModel, userType });
          // Validate senderModel and receiverModel
          const validModels = ['User', 'Seller'];
          const resolvedSenderModel = validModels.includes(senderModel) ? senderModel : (userType === 'user' ? 'User' : 'Seller');
          const resolvedReceiverModel = validModels.includes(receiverModel) ? receiverModel : (userType === 'user' ? 'Seller' : 'User');

          // Verify sender and receiver exist
          const sender = await (resolvedSenderModel === 'User' ? User : Seller).findById(senderId);
          const receiver = await (resolvedReceiverModel === 'User' ? User : Seller).findById(receiverId);
          if (!sender || !receiver) {
            console.error('Invalid sender or receiver:', { senderId, receiverId });
            throw new Error('Invalid sender or receiver');
          }

          const message = new Message({
            senderId,
            receiverId,
            content,
            senderModel: resolvedSenderModel,
            receiverModel: resolvedReceiverModel,
          });
          await message.save();
          const room = [senderId, receiverId].sort().join('-');
          io.to(room).emit('receiveMessage', {
            senderId,
            receiverId,
            content,
            timestamp: message.timestamp,
            senderModel: resolvedSenderModel,
            receiverModel: resolvedReceiverModel,
          });
          console.log(`Message sent to room ${room}:`, { content, timestamp: message.timestamp });
        } catch (error) {
          console.error('Error saving message:', error.message, error.stack);
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // Start listening
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();