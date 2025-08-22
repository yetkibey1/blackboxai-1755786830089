const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/', auth.authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// Get single order
router.get('/:id', auth.authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// Create order
router.post('/', [
  auth.authenticateToken,
  body('items').isArray().withMessage('Items must be an array'),
  body('shippingAddress').isObject().withMessage('Shipping address is required')
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
    
    const orderData = {
      ...req.body,
      user: req.user._id,
      status: 'pending'
    };
    
    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// Update order status (Admin only)
router.put('/:id/status', [
  auth.authenticateToken,
  auth.authorizeRoles('admin', 'manager'),
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
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
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

module.exports = router;
