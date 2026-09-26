require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const setupSlotSocket = require('./socket/slotSocket');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Create HTTP Server & Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Pass io to Express app for route access
app.set('io', io);

// Initialize real-time socket events
setupSlotSocket(io);

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 MV ProShoot Server running on port :${PORT}`);
  console.log(`📡 Socket.io connected and ready for real-time slots`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
