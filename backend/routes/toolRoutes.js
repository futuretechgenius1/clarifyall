const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Tool = require('../models/Tool');
const upload = require('../config/multer');
const { query } = require('../config/database');

// Validation middleware
const validateToolSubmission = [
  body('name').trim().notEmpty().withMessage('Tool name is required').isLength({ max: 100 }),
  body('websiteUrl').trim().notEmpty().withMessage('Website URL is required').matches(/^https?:\/\//).withMessage('URL must start with http:// or https://'),
  body('categoryIds').isArray({ min: 1, max: 3 }).withMessage('Select 1-3 categories'),
  body('pricingModel').isIn(['FREE', 'FREEMIUM', 'FREE_TRIAL', 'PAID']).withMessage('Invalid pricing model'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required').isLength({ max: 150 }),
  body('fullDescription').optional().isLength({ max: 2000 }),
  body('submitterEmail').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format')
];

// ADMIN ROUTES - Must come before /:id route to avoid conflicts

// Get all tools (including pending, rejected) - Admin only
router.get('/all', async (req, res, next) => {
  try {
    const filters = {
      page: 0,
      size: 1000, // Get all tools
      status: null // Include all statuses
    };
    
    const result = await Tool.findAll(filters);
    console.log('Admin /all endpoint - Found tools:', result.content.length);
    res.json(result.content);
  } catch (error) {
    console.error('Error in /all endpoint:', error);
    next(error);
  }
});

// Get all tools with filters
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 0,
      size: parseInt(req.query.size) || 12,
      pricingModel: req.query.pricingModel,
      categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : null,
      searchTerm: req.query.searchTerm,
      status: 'APPROVED',
      platforms: req.query.platforms ? (Array.isArray(req.query.platforms) ? req.query.platforms : [req.query.platforms]) : null,
      featureTags: req.query.featureTags ? (Array.isArray(req.query.featureTags) ? req.query.featureTags : [req.query.featureTags]) : null,
      sortBy: req.query.sortBy || 'RECENT'
    };

    const result = await Tool.findAll(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get tool by ID
router.get('/:id', async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    next(error);
  }
});

// Submit new tool
router.post('/submit', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'tool', maxCount: 1 }]), async (req, res, next) => {
  try {
    // Check if logo was uploaded
    if (!req.files || !req.files.logo || !req.files.logo[0]) {
      return res.status(400).json({ error: 'Logo file is required' });
    }

    // Parse toolData from form (frontend sends it as 'tool')
    let toolData;
    try {
      // The tool data comes as a file when using upload.fields()
      if (req.files.tool && req.files.tool[0]) {
        const toolBuffer = req.files.tool[0].buffer;
        toolData = JSON.parse(toolBuffer.toString('utf-8'));
      } else if (req.body.tool) {
        toolData = JSON.parse(req.body.tool);
      } else {
        return res.status(400).json({ 
          error: 'Tool data is required'
        });
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({ 
        error: 'Invalid tool data format',
        details: 'Tool data must be valid JSON',
        parseError: parseError.message
      });
    }

    // Validate toolData
    const validationErrors = [];
    if (!toolData.name) validationErrors.push('Tool name is required');
    if (!toolData.websiteUrl) validationErrors.push('Website URL is required');
    if (!toolData.categoryIds || toolData.categoryIds.length === 0) validationErrors.push('At least one category is required');
    if (toolData.categoryIds && toolData.categoryIds.length > 3) validationErrors.push('Maximum 3 categories allowed');
    if (!toolData.pricingModel) validationErrors.push('Pricing model is required');
    if (!['FREE', 'FREEMIUM', 'FREE_TRIAL', 'PAID'].includes(toolData.pricingModel)) {
      validationErrors.push('Invalid pricing model');
    }
    if (!toolData.shortDescription) validationErrors.push('Short description is required');
    if (toolData.shortDescription && toolData.shortDescription.length > 150) {
      validationErrors.push('Short description must be 150 characters or less');
    }
    if (!toolData.submitterEmail) validationErrors.push('Email is required');
    if (toolData.submitterEmail && !toolData.submitterEmail.includes('@')) {
      validationErrors.push('Invalid email format');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    // Save logo file from memory to disk
    const fs = require('fs');
    const path = require('path');
    const uploadDir = process.env.UPLOAD_DIR || 'uploads/logos';
    const logoFile = req.files.logo[0];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(logoFile.originalname);
    const nameWithoutExt = path.basename(logoFile.originalname, ext);
    const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filepath, logoFile.buffer);

    // Create tool with logo URL
    const logoUrl = `/api/v1/files/logos/${filename}`;
    const newTool = await Tool.create({
      ...toolData,
      logoUrl
    });

    res.status(201).json({
      message: 'Tool submitted successfully! Awaiting review.',
      toolId: newTool.id
    });
  } catch (error) {
    console.error('Tool submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit tool',
      details: error.message 
    });
  }
});

// Increment view count
router.post('/:id/view', async (req, res, next) => {
  try {
    const viewCount = await Tool.incrementViewCount(req.params.id);
    res.json({ 
      message: 'View count incremented', 
      viewCount 
    });
  } catch (error) {
    next(error);
  }
});

// Increment save count
router.post('/:id/save', async (req, res, next) => {
  try {
    const saveCount = await Tool.incrementSaveCount(req.params.id);
    res.json({ 
      message: 'Save count incremented', 
      saveCount 
    });
  } catch (error) {
    next(error);
  }
});

// Get similar tools
router.get('/:id/similar', async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    const categoryIds = tool.categories.map(c => c.id);
    const similarTools = await Tool.findSimilar(req.params.id, categoryIds, 4);
    res.json(similarTools);
  } catch (error) {
    next(error);
  }
});

// Get popular tools
router.get('/popular', async (req, res, next) => {
  try {
    const tools = await Tool.findPopular(10);
    res.json(tools);
  } catch (error) {
    next(error);
  }
});

// Get recent tools
router.get('/recent', async (req, res, next) => {
  try {
    const tools = await Tool.findRecent(10);
    res.json(tools);
  } catch (error) {
    next(error);
  }
});

// OTHER ADMIN ROUTES

// Upload/Replace logo for existing tool - Admin only
router.post('/:id/upload-logo', upload.single('logo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Logo file is required' });
    }

    // Save logo file from memory to disk
    const fs = require('fs');
    const path = require('path');
    const uploadDir = process.env.UPLOAD_DIR || 'uploads/logos';
    const logoFile = req.file;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(logoFile.originalname);
    const nameWithoutExt = path.basename(logoFile.originalname, ext);
    const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadDir, filename);
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Write file to disk
    fs.writeFileSync(filepath, logoFile.buffer);

    // Get old logo URL to delete old file
    const [oldTool] = await query('SELECT logo_url FROM tools WHERE id = ?', [req.params.id]);
    
    // Update tool with new logo URL
    const logoUrl = `/api/v1/files/logos/${filename}`;
    await query('UPDATE tools SET logo_url = ?, updated_at = NOW() WHERE id = ?', [logoUrl, req.params.id]);
    
    // Delete old logo file if it exists
    if (oldTool && oldTool.logo_url) {
      const oldFilename = path.basename(oldTool.logo_url);
      const oldFilepath = path.join(uploadDir, oldFilename);
      if (fs.existsSync(oldFilepath)) {
        fs.unlinkSync(oldFilepath);
      }
    }
    
    res.json({ 
      message: 'Logo uploaded successfully',
      logoUrl 
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    next(error);
  }
});

// Update tool - Admin only
router.put('/:id', async (req, res, next) => {
  try {
    const { name, websiteUrl, shortDescription, fullDescription, pricingModel, categoryIds } = req.body;
    
    // Update tool basic info
    await query(
      'UPDATE tools SET name = ?, website_url = ?, short_description = ?, full_description = ?, pricing_model = ?, updated_at = NOW() WHERE id = ?',
      [name, websiteUrl, shortDescription, fullDescription || null, pricingModel, req.params.id]
    );
    
    // Update categories if provided
    if (categoryIds && categoryIds.length > 0) {
      // Delete existing categories
      await query('DELETE FROM tool_categories WHERE tool_id = ?', [req.params.id]);
      
      // Add new categories
      for (const categoryId of categoryIds) {
        await query('INSERT INTO tool_categories (tool_id, category_id) VALUES (?, ?)', [req.params.id, categoryId]);
      }
    }
    
    res.json({ message: 'Tool updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Approve tool - Admin only
router.put('/:id/approve', async (req, res, next) => {
  try {
    await Tool.updateStatus(req.params.id, 'APPROVED');
    res.json({ 
      message: 'Tool approved successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Reject tool - Admin only
router.put('/:id/reject', async (req, res, next) => {
  try {
    await Tool.updateStatus(req.params.id, 'REJECTED');
    res.json({ 
      message: 'Tool rejected successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// Delete tool - Admin only
router.delete('/:id', async (req, res, next) => {
  try {
    await Tool.delete(req.params.id);
    res.json({ 
      message: 'Tool deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
