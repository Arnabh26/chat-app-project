// controllers/messageController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { conversationId, text, replyTo } = req.body;
  const message = new Message({
    conversationId,
    sender: req.user._id,
    text,
    replyTo,
    seenBy: [req.user._id],
  });
  await message.save();
  res.status(201).json(message);
};

exports.uploadFile = async (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  const message = new Message({
    conversationId: req.body.conversationId,
    sender: req.user._id,
    fileUrl,
    seenBy: [req.user._id],
  });
  await message.save();
  res.json(message);
};

exports.getMessages = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const messages = await Message.find({ conversationId: req.params.conversationId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('sender', 'username')
    .populate('replyTo');
  res.json(messages);
};