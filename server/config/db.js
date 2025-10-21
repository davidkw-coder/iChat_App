const mysql = require('mysql2/promise'); // Use promise-based version
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',  // ← Force empty string if not set
  database: process.env.DB_NAME || 'schoolchat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const connectDB = async () => {
  try {
    await pool.getConnection(); // Try to get a connection to verify
    console.log('MySQL Connected...');
  } catch (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool }; // Export pool for queries