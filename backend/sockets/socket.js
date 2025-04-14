// sockets/socket.js
const Message = require('../models/Message');
function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('sendMessage', async (data) => {
      const message = new Message(data);
      await message.save();
      io.to(data.conversationId).emit('receiveMessage', message);
    });

    socket.on('typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('typing', userId);
    });

    socket.on('seen', async ({ conversationId, userId }) => {
      await Message.updateMany(
        { conversationId, seenBy: { $ne: userId } },
        { $addToSet: { seenBy: userId } }
      );
    });
  });
}

module.exports = { setupSocket };