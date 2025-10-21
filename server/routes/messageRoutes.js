const express = require('express');
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:receiverId', protect, getMessages);
router.post('/', protect, sendMessage); // Primarily for REST fallback, Socket.IO handles real-time

module.exports = router;