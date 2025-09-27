const mysql = require("mysql2/promise");

// --- CRITICAL FIX: Ensure blank password is treated as an empty string ---
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || ''; // If DB_PASS is unset or blank in .env, use an empty string
const DB_NAME = process.env.DB_NAME || 'fb_clone';

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;