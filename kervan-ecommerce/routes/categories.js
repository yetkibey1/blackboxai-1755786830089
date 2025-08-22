const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    
    const query = includeInactive === 'true' ? {} : { status: 'active' };
    
    const categories = await Category.find(query)
      .populate('parent', 'name')
      .populate('children', 'name')
      .sort({ sortOrder: 1, 'name.en': 1 });
    
    // Transform categories for frontend consumption
    const transformedCategories = categories.map(category => ({
      _id: category._id,
      name: category.name.en || category.name.ka || category.name.tr,
      nameMultilingual: category.name,
      description: category.description?.en || category.description?.ka || category.description?.tr || '',
      descriptionMultilingual: category.description,
      slug: category.slug,
      parent: category.parent,
      children: category.children,
      image: category.image,
      icon: category.icon,
      status: category.status,
      featured: category.featured,
      sortOrder: category.sortOrder,
      productCount: category.productCount,
      seo: category.seo,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));
    
    res.json({
      success: true,
      data: { categories: transformedCategories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category'
    });
  }
});

// Create category (Admin only)
router.post('/', [
  auth.authenticateToken,
  auth.authorizeRoles('admin', 'manager'),
  body('name').trim().isLength({ min: 2 }).withMessage('Category name must be at least 2 characters'),
  body('description').optional().trim()
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
    
    const category = new Category(req.body);
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
});

// Update category (Admin only)
router.put('/:id', [
  auth.authenticateToken,
  auth.authorizeRoles('admin', 'manager'),
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim()
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
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
});

// Delete category (Admin only)
router.delete('/:id', [
  auth.authenticateToken,
  auth.authorizeRoles('admin')
], async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
});

module.exports = router;
