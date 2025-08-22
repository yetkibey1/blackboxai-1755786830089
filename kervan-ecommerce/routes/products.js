const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      sort = 'createdAt',
      minPrice,
      maxPrice,
      status = 'active',
      featured,
      tags
    } = req.query;
    
    const query = { status: status };
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Add search filter (search in multilingual names and descriptions)
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.ka': { $regex: search, $options: 'i' } },
        { 'name.tr': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.ka': { $regex: search, $options: 'i' } },
        { 'description.tr': { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Add price range filter
    if (minPrice || maxPrice) {
      query['pricing.price1'] = {};
      if (minPrice) query['pricing.price1'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.price1'].$lte = parseFloat(maxPrice);
    }
    
    // Add featured filter
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { 'pricing.price1': 1 };
        break;
      case 'price_desc':
        sortObj = { 'pricing.price1': -1 };
        break;
      case 'name_asc':
        sortObj = { 'name.en': 1 };
        break;
      case 'name_desc':
        sortObj = { 'name.en': -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'featured':
        sortObj = { featured: -1, createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();
    
    const total = await Product.countDocuments(query);
    
    // Transform products for frontend consumption
    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.name.en || product.name.ka || product.name.tr,
      description: product.description?.en || product.description?.ka || product.description?.tr || '',
      price: product.pricing.price1,
      currency: product.pricing.currency,
      category: product.category,
      images: product.images,
      inStock: product.inventory.stock > 0,
      stock: product.inventory.stock,
      featured: product.featured,
      status: product.status,
      code: product.code,
      slug: product.slug,
      tags: product.tags,
      ratings: product.ratings,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    
    res.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1
        },
        filters: {
          category,
          search,
          minPrice,
          maxPrice,
          status,
          featured,
          tags,
          sort
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    const query = id.match(/^[0-9a-fA-F]{24}$/) 
      ? { _id: id } 
      : { slug: id };
    
    const product = await Product.findOne(query)
      .populate('category', 'name')
      .populate('relatedProducts', 'name pricing images slug');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Transform product for frontend consumption
    const transformedProduct = {
      _id: product._id,
      name: product.name.en || product.name.ka || product.name.tr,
      nameMultilingual: product.name,
      description: product.description?.en || product.description?.ka || product.description?.tr || '',
      descriptionMultilingual: product.description,
      slug: product.slug,
      code: product.code,
      barcode: product.barcode,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images,
      pricing: {
        price: product.pricing.price1,
        price1: product.pricing.price1,
        price2: product.pricing.price2,
        price3: product.pricing.price3,
        activePrice: product.pricing.activePrice,
        currency: product.pricing.currency
      },
      quantityDiscounts: product.quantityDiscounts,
      inventory: {
        stock: product.inventory.stock,
        inStock: product.inventory.stock > 0,
        minStockLevel: product.inventory.minStockLevel,
        maxStockLevel: product.inventory.maxStockLevel,
        unit: product.inventory.unit,
        trackInventory: product.inventory.trackInventory
      },
      specifications: product.specifications,
      status: product.status,
      featured: product.featured,
      tags: product.tags,
      relatedProducts: product.relatedProducts,
      ratings: product.ratings,
      sales: product.sales,
      seo: product.seo,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
    
    res.json({
      success: true,
      data: { product: transformedProduct }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create product (Admin only)
router.post('/', [
  auth.authenticateToken,
  auth.authorizeRoles('admin', 'manager'),
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isMongoId().withMessage('Valid category ID is required')
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
    
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
});

// Update product (Admin only)
router.put('/:id', [
  auth.authenticateToken,
  auth.authorizeRoles('admin', 'manager'),
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price').optional().isNumeric()
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
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', [
  auth.authenticateToken,
  auth.authorizeRoles('admin')
], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

module.exports = router;
