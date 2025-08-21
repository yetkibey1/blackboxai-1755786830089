const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    ka: { type: String, required: true },
    en: { type: String, required: true },
    tr: { type: String }
  },
  slug: {
    type: String,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    ka: String,
    en: String,
    tr: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  pricing: {
    price1: { type: Number, required: true, min: 0 },
    price2: { type: Number, min: 0 },
    price3: { type: Number, min: 0 },
    activePrice: {
      type: String,
      enum: ['price1', 'price2', 'price3'],
      default: 'price1'
    },
    currency: { type: String, default: 'GEL' }
  },
  quantityDiscounts: [{
    minQuantity: { type: Number, required: true },
    maxQuantity: Number,
    price: { type: Number, required: true },
    discountPercent: Number
  }],
  inventory: {
    stock: { type: Number, required: true, min: 0, default: 0 },
    minStockLevel: { type: Number, default: 10 },
    maxStockLevel: Number,
    unit: { type: String, default: 'pcs' },
    trackInventory: { type: Boolean, default: true }
  },
  specifications: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'cm' }
    },
    weight: {
      value: Number,
      unit: { type: String, default: 'kg' }
    },
    material: String,
    color: String,
    brand: String
  },
  seo: {
    metaTitle: {
      ka: String,
      en: String,
      tr: String
    },
    metaDescription: {
      ka: String,
      en: String,
      tr: String
    },
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  sales: {
    totalSold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name.en') || this.isNew) {
    this.slug = slugify(this.name.en, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Calculate active price based on quantity
productSchema.methods.getPriceForQuantity = function(quantity) {
  // Check quantity discounts first
  if (this.quantityDiscounts && this.quantityDiscounts.length > 0) {
    const applicableDiscount = this.quantityDiscounts
      .filter(discount => quantity >= discount.minQuantity && 
                         (!discount.maxQuantity || quantity <= discount.maxQuantity))
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];
    
    if (applicableDiscount) {
      return applicableDiscount.price;
    }
  }
  
  // Return active price
  return this.pricing[this.pricing.activePrice];
};

// Check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  if (!this.inventory.trackInventory) return true;
  return this.inventory.stock >= quantity && this.status === 'active';
};

// Update stock
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (!this.inventory.trackInventory) return;
  
  if (operation === 'subtract') {
    this.inventory.stock = Math.max(0, this.inventory.stock - quantity);
    if (this.inventory.stock === 0) {
      this.status = 'out_of_stock';
    }
  } else if (operation === 'add') {
    this.inventory.stock += quantity;
    if (this.status === 'out_of_stock' && this.inventory.stock > 0) {
      this.status = 'active';
    }
  }
};

// Indexes for better performance
productSchema.index({ slug: 1 });
productSchema.index({ code: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'name.ka': 'text', 'name.en': 'text', 'description.ka': 'text', 'description.en': 'text' });

module.exports = mongoose.model('Product', productSchema);
