const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads/logos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage - use memory storage for 'tool' field, disk storage for 'logo'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Only save logo files to disk
    if (file.fieldname === 'logo') {
      cb(null, uploadDir);
    } else {
      cb(null, uploadDir); // This won't be used for 'tool' field
    }
  },
  filename: (req, file, cb) => {
    // Only generate filename for logo files
    if (file.fieldname === 'logo') {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    } else {
      cb(null, file.originalname); // This won't be used for 'tool' field
    }
  }
});

// Use memory storage for better handling of both file types
const memoryStorage = multer.memoryStorage();

// File filter - only validate images for 'logo' field, allow 'tool' field (JSON data)
const fileFilter = (req, file, cb) => {
  // If it's the 'tool' field (JSON data), allow it
  if (file.fieldname === 'tool') {
    cb(null, true);
    return;
  }
  
  // For 'logo' field, validate image types
  if (file.fieldname === 'logo') {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
  } else {
    // Reject any other unexpected fields
    cb(new Error('Unexpected field: ' + file.fieldname), false);
  }
};

// Configure multer with memory storage (stores files in memory as Buffer)
const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

module.exports = upload;
