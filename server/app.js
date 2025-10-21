const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { connectDB } = require('./config/db'); // ✅ Fix here

// Connect to MySQL
connectDB();


const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Body parser for JSON data

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;