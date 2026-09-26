const Slot = require('../models/Slot');

const setupSlotSocket = (io) => {
  io.on('connection', (socket) => {
    // Client joins date-based room to receive targeted slot updates
    socket.on('join:date', (date) => {
      socket.join(`date:${date}`);
    });

    socket.on('leave:date', (date) => {
      socket.leave(`date:${date}`);
    });

    // Real-time slot inspection notice
    socket.on('slot:inspecting', ({ slotId, userName }) => {
      socket.broadcast.emit('slot:user_viewing', { slotId, userName });
    });

    socket.on('disconnect', () => {
      // Automatic cleanup if needed
    });
  });
};

module.exports = setupSlotSocket;
