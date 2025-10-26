const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// Update user profile (must come before /:userId)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio } = req.body;
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    const updatedUser = await User.updateProfile(userId, updates);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Upload avatar (must come before /:userId)
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    const updatedUser = await User.updateProfile(userId, { avatar: avatarUrl });
    
    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: error.message
    });
  }
});

// Get user's saved tools (must come before /:userId)
router.get('/saved-tools', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await User.getSavedTools(userId, page, limit);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get saved tools error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved tools',
      error: error.message
    });
  }
});

// Check if user has saved a tool (must come before /:userId)
router.get('/saved-tools/:toolId/check', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { toolId } = req.params;
    
    const isSaved = await User.hasSavedTool(userId, parseInt(toolId));
    
    res.json({
      success: true,
      isSaved
    });
  } catch (error) {
    console.error('Check saved tool error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check saved status',
      error: error.message
    });
  }
});

// Get user's submitted tools
router.get('/:userId/tools', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await User.getUserTools(userId, page, limit);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get user tools error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user tools',
      error: error.message
    });
  }
});

// Save/bookmark a tool
router.post('/saved-tools/:toolId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { toolId } = req.params;
    
    const success = await User.saveTool(userId, parseInt(toolId));
    
    if (success) {
      res.json({
        success: true,
        message: 'Tool saved successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Tool already saved'
      });
    }
  } catch (error) {
    console.error('Save tool error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save tool',
      error: error.message
    });
  }
});

// Unsave/unbookmark a tool
router.delete('/saved-tools/:toolId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { toolId } = req.params;
    
    const success = await User.unsaveTool(userId, parseInt(toolId));
    
    if (success) {
      res.json({
        success: true,
        message: 'Tool removed from saved'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Tool not found in saved list'
      });
    }
  } catch (error) {
    console.error('Unsave tool error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsave tool',
      error: error.message
    });
  }
});

// Delete user account (must come before /:userId)
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    // Verify password before deletion
    const user = await User.findByEmail(req.user.email);
    
    if (user.password) {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password required to delete account'
        });
      }
      
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }
    }
    
    const success = await User.deleteAccount(userId);
    
    if (success) {
      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
});

// Get user profile by ID (must come LAST - after all specific routes)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

module.exports = router;
