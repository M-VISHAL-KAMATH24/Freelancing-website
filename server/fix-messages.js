const mongoose = require('mongoose');
const User = require('./models/User');
const Seller = require('./models/Seller');
const Message = require('./models/Message');

async function fixMessages() {
  try {
    // Connect to MongoDB (replace with your MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://vishal_kamath:Vil100sr@cluster0.ba7dqen.mongodb.net/freelance-marketplace?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find all messages
    const messages = await Message.find({});

    for (const msg of messages) {
      // Skip if already has valid senderModel and receiverModel
      if (['User', 'Seller'].includes(msg.senderModel) && ['User', 'Seller'].includes(msg.receiverModel)) {
        console.log(`Message ${msg._id} already valid`);
        continue;
      }

      // Determine senderModel
      const userSender = await User.findById(msg.senderId);
      const sellerSender = await Seller.findById(msg.senderId);
      const senderModel = userSender ? 'User' : sellerSender ? 'Seller' : null;

      // Determine receiverModel
      const userReceiver = await User.findById(msg.receiverId);
      const sellerReceiver = await Seller.findById(msg.receiverId);
      const receiverModel = userReceiver ? 'User' : sellerReceiver ? 'Seller' : null;

      if (!senderModel || !receiverModel) {
        console.log(`Deleting invalid message: ${msg._id}`);
        await Message.deleteOne({ _id: msg._id });
        continue;
      }

      // Update message
      msg.senderModel = senderModel;
      msg.receiverModel = receiverModel;
      await msg.save();
      console.log(`Updated message: ${msg._id}`);
    }

    console.log('Message migration completed');
  } catch (error) {
    console.error('Error during migration:', error.message, error.stack);
  } finally {
    await mongoose.connection.close();
  }
}

fixMessages();