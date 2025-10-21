const { pool } = require('../config/db'); // MySQL pool

// @desc    Get messages for a conversation between two users
// @route   GET /api/messages/:receiverId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    const [messages] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender = ? AND receiver = ?) 
          OR (sender = ? AND receiver = ?)
       ORDER BY timestamp ASC`,
      [senderId, receiverId, receiverId, senderId]
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get Messages Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Please provide receiverId and message' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)',
      [senderId, receiverId, message]
    );

    const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    const newMessage = rows[0];

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send Message Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMessages, sendMessage };
