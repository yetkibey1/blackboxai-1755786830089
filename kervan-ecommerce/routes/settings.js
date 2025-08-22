const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne() || {};
    
    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching settings'
    });
  }
});

// Update settings (Admin only)
router.put('/', [
  auth.authenticateToken,
  auth.authorizeRoles('admin'),
  body('siteName').optional().trim(),
  body('siteDescription').optional().trim(),
  body('contactEmail').optional().isEmail(),
  body('currency').optional().trim(),
  body('language').optional().isIn(['ka', 'en', 'tr'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating settings'
    });
  }
});

module.exports = router;
