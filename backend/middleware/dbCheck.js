const { pool } = require('../config/db');

const dbCheck = async (req, res, next) => {
  try {
    await pool.execute('SELECT 1');
    next();
  } catch (error) {
    return res.status(500).json({ 
      message: 'Database not available. Please check your MySQL connection.' 
    });
  }
};

module.exports = dbCheck;