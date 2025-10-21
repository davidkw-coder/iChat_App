const { pool } = require('../config/db'); // MySQL pool

// @desc    Get all users except the logged-in one
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    // Fetch all users except the currently logged-in user
    const [rows] = await pool.query(
      'SELECT id, name, email, role, createdAt FROM users WHERE id != ?',
      [req.user.id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Get Users Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers };
