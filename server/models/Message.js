const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Optional: for group chats
  // conversation: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Conversation',
  //   required: false,
  // }
});

module.exports = mongoose.model('Message', MessageSchema);