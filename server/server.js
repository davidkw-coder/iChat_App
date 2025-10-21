const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});


// Store connected users (socketId to userId mapping) for direct messaging
let onlineUsers = {}; // { userId: socketId }

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user logs in, associate their userId with their socketId
  socket.on('addUser', (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(onlineUsers)); // Notify all clients
    console.log(`User ${userId} added with socket ID ${socket.id}. Online users:`, onlineUsers);
  });

  // Handle 'sendMessage' event from client
  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    // Optional: Save message to DB before emitting
    const { pool } = require('./config/db'); // Use MySQL pool instead of Mongoose
    try {
      const [result] = await pool.query(
        'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)',
        [senderId, receiverId, message]
      );

      const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
      const newMessage = rows[0];

      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
        if (onlineUsers[senderId] && onlineUsers[senderId] !== receiverSocketId) {
          io.to(onlineUsers[senderId]).emit('receiveMessage', newMessage);
        }
      } else {
        console.log(`Receiver ${receiverId} is offline, message saved to DB.`);
        if (onlineUsers[senderId]) {
          io.to(onlineUsers[senderId]).emit('receiveMessage', newMessage);
        }
      }
    } catch (error) {
      console.error('Error saving message or emitting:', error);
    }
  });

  // Handle typing indicator
  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { senderId });
    }
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('stopTyping', { senderId });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    io.emit('getOnlineUsers', Object.keys(onlineUsers));
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
