const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    guest: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String
    },
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productSnapshot: {
      name: {
        ka: String,
        en: String,
        tr: String
      },
      code: String,
      image: String,
      specifications: mongoose.Schema.Types.Mixed
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    appliedDiscount: {
      type: Number,
      default: 0
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      amount: { type: Number, default: 0 },
      rate: { type: Number, default: 0 }
    },
    shipping: {
      amount: { type: Number, default: 0 },
      method: String
    },
    discount: {
      amount: { type: Number, default: 0 },
      code: String,
      type: String
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'GEL'
    }
  },
  shipping: {
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      company: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: 'Georgia' },
      phone: { type: String, required: true },
      email: { type: String, required: true }
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup', 'courier'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    estimatedDelivery: Date,
    trackingNumber: String,
    carrier: String,
    notes: String
  },
  payment: {
    method: {
      type: String,
      enum: ['bank_transfer', 'credit_card', 'cash_on_delivery', 'tbc_bank'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String,
    paymentDate: Date,
    bankDetails: {
      bankName: String,
      accountNumber: String,
      referenceNumber: String
    },
    cardDetails: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    customer: String,
    admin: String,
    internal: String
  },
  communication: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'call', 'note']
    },
    content: String,
    sentAt: { type: Date, default: Date.now },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  metadata: {
    source: {
      type: String,
      enum: ['website', 'admin', 'api', 'import'],
      default: 'website'
    },
    userAgent: String,
    ipAddress: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const lastOrder = await mongoose.model('Order')
      .findOne({
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      })
      .sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `KRV${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      note: `Status changed to ${this.status}`
    });
  }
  next();
});

// Calculate totals
orderSchema.methods.calculateTotals = function() {
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.pricing.total = this.pricing.subtotal + 
                      this.pricing.tax.amount + 
                      this.pricing.shipping.amount - 
                      this.pricing.discount.amount;
};

// Check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Check if order can be refunded
orderSchema.methods.canBeRefunded = function() {
  return ['delivered'].includes(this.status) && 
         this.payment.status === 'completed';
};

// Get customer info (guest or registered)
orderSchema.methods.getCustomerInfo = function() {
  if (this.customer.isGuest) {
    return {
      name: `${this.customer.guest.firstName} ${this.customer.guest.lastName}`,
      email: this.customer.guest.email,
      phone: this.customer.guest.phone,
      isGuest: true
    };
  } else {
    return {
      name: `${this.customer.user.firstName} ${this.customer.user.lastName}`,
      email: this.customer.user.email,
      phone: this.customer.user.phone,
      isGuest: false,
      userId: this.customer.user._id
    };
  }
};

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.user': 1 });
orderSchema.index({ 'customer.guest.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
