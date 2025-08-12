// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // ej: 'root'
  password: 'root',   // ej: '1234'
  database: 'techno_express',   // ej: 'mi_app_db'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
