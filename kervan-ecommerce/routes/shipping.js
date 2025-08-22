const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Get shipping methods
router.get('/methods', async (req, res) => {
  try {
    const shippingMethods = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Delivery within 5-7 business days',
        price: 5.99,
        estimatedDays: '5-7',
        enabled: true
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: 'Delivery within 2-3 business days',
        price: 12.99,
        estimatedDays: '2-3',
        enabled: true
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Next business day delivery',
        price: 24.99,
        estimatedDays: '1',
        enabled: true
      },
      {
        id: 'free',
        name: 'Free Shipping',
        description: 'Free delivery for orders over $100',
        price: 0,
        estimatedDays: '7-10',
        enabled: true,
        minimumOrder: 100
      }
    ];

    res.json({
      success: true,
      data: { shippingMethods }
    });
  } catch (error) {
    console.error('Get shipping methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shipping methods'
    });
  }
});

// Calculate shipping cost
router.post('/calculate', [
  body('items').isArray().withMessage('Items must be an array'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingMethod').notEmpty().withMessage('Shipping method is required')
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

    const { items, shippingAddress, shippingMethod } = req.body;

    // Calculate total weight and value
    let totalWeight = 0;
    let totalValue = 0;

    items.forEach(item => {
      totalWeight += (item.weight || 1) * item.quantity;
      totalValue += item.price * item.quantity;
    });

    // Get shipping method details
    const shippingMethods = {
      standard: { price: 5.99, estimatedDays: '5-7' },
      express: { price: 12.99, estimatedDays: '2-3' },
      overnight: { price: 24.99, estimatedDays: '1' },
      free: { price: 0, estimatedDays: '7-10', minimumOrder: 100 }
    };

    const selectedMethod = shippingMethods[shippingMethod];
    
    if (!selectedMethod) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipping method'
      });
    }

    let shippingCost = selectedMethod.price;

    // Apply free shipping if eligible
    if (shippingMethod === 'free' && totalValue < selectedMethod.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Free shipping requires minimum order of $${selectedMethod.minimumOrder}`
      });
    }

    // Add weight-based pricing for heavy items
    if (totalWeight > 10) {
      shippingCost += (totalWeight - 10) * 0.5;
    }

    const shippingCalculation = {
      method: shippingMethod,
      cost: shippingCost,
      estimatedDays: selectedMethod.estimatedDays,
      totalWeight,
      totalValue,
      shippingAddress
    };

    res.json({
      success: true,
      data: { shipping: shippingCalculation }
    });
  } catch (error) {
    console.error('Calculate shipping error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating shipping'
    });
  }
});

// Track shipment
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    // TODO: Implement actual shipment tracking
    // This would integrate with shipping providers' APIs
    
    // For now, simulate tracking information
    const trackingInfo = {
      trackingNumber,
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      events: [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'picked_up',
          location: 'Tbilisi, Georgia',
          description: 'Package picked up from sender'
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'in_transit',
          location: 'Batumi, Georgia',
          description: 'Package in transit'
        }
      ]
    };

    res.json({
      success: true,
      data: { tracking: trackingInfo }
    });
  } catch (error) {
    console.error('Track shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking shipment'
    });
  }
});

// Update shipping rates (Admin only)
router.put('/methods/:id', [
  auth.authenticateToken,
  auth.authorizeRoles('admin'),
  body('price').optional().isNumeric(),
  body('enabled').optional().isBoolean(),
  body('estimatedDays').optional().notEmpty()
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

    // TODO: Implement actual shipping method update
    // This would update shipping methods in the database
    
    res.json({
      success: true,
      message: 'Shipping method updated successfully',
      data: { 
        id: req.params.id,
        ...req.body,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Update shipping method error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating shipping method'
    });
  }
});

module.exports = router;
