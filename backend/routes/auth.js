const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/admins.json');

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123' // In production, use bcrypt hash
};

// POST login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'admin-token-' + Date.now() // Simple token for demo
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;



