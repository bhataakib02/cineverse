const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { importCSVToJSON } = require('../utils/csvParser');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// POST /api/import/csv - Import CSV file
router.post('/csv', upload.single('csvfile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const csvFilePath = req.file.path;
    const jsonOutputPath = path.join(__dirname, '../data/movies.json');

    // Import CSV to JSON
    const movies = importCSVToJSON(csvFilePath, jsonOutputPath);

    // Clean up uploaded file
    fs.unlinkSync(csvFilePath);

    res.json({
      success: true,
      message: `Successfully imported ${movies.length} movies`,
      count: movies.length
    });
  } catch (error) {
    console.error('Error importing CSV:', error);
    res.status(500).json({ error: error.message || 'Failed to import CSV' });
  }
});

// POST /api/import/path - Import CSV from file path (for admin use)
router.post('/path', (req, res) => {
  try {
    const { csvPath } = req.body;
    
    if (!csvPath || !fs.existsSync(csvPath)) {
      return res.status(400).json({ error: 'Invalid CSV file path' });
    }

    const jsonOutputPath = path.join(__dirname, '../data/movies.json');
    const movies = importCSVToJSON(csvPath, jsonOutputPath);

    res.json({
      success: true,
      message: `Successfully imported ${movies.length} movies`,
      count: movies.length
    });
  } catch (error) {
    console.error('Error importing CSV:', error);
    res.status(500).json({ error: error.message || 'Failed to import CSV' });
  }
});

module.exports = router;

