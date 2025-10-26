const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Serve logo files
router.get('/logos/:filename', (req, res, next) => {
  try {
    const filename = req.params.filename;
    const uploadDir = process.env.UPLOAD_DIR || 'uploads/logos';
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
