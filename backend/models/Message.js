// models/Message.js
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  fileUrl: String,
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('Message', messageSchema);