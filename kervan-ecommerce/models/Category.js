const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    ka: { type: String, required: true },
    en: { type: String, required: true },
    tr: { type: String }
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    ka: String,
    en: String,
    tr: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  image: {
    url: String,
    alt: String
  },
  icon: {
    name: String,
    color: String
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
    enum: ['active', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  productCount: {
    type: Number,
    default: 0
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
categorySchema.pre('save', function(next) {
  if (this.isModified('name.en') || this.isNew) {
    this.slug = slugify(this.name.en, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Update parent's children array when category is saved
categorySchema.post('save', async function(doc) {
  if (doc.parent) {
    await mongoose.model('Category').findByIdAndUpdate(
      doc.parent,
      { $addToSet: { children: doc._id } }
    );
  }
});

// Remove from parent's children array when category is removed
categorySchema.post('remove', async function(doc) {
  if (doc.parent) {
    await mongoose.model('Category').findByIdAndUpdate(
      doc.parent,
      { $pull: { children: doc._id } }
    );
  }
});

// Get category hierarchy
categorySchema.methods.getHierarchy = async function() {
  const hierarchy = [];
  let current = this;
  
  while (current) {
    hierarchy.unshift({
      _id: current._id,
      name: current.name,
      slug: current.slug
    });
    
    if (current.parent) {
      current = await mongoose.model('Category').findById(current.parent);
    } else {
      current = null;
    }
  }
  
  return hierarchy;
};

// Get all subcategories (recursive)
categorySchema.methods.getAllSubcategories = async function() {
  const subcategories = [];
  
  const getChildren = async (categoryId) => {
    const children = await mongoose.model('Category').find({ parent: categoryId });
    
    for (const child of children) {
      subcategories.push(child._id);
      await getChildren(child._id);
    }
  };
  
  await getChildren(this._id);
  return subcategories;
};

// Check if category has products
categorySchema.methods.hasProducts = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    $or: [
      { category: this._id },
      { subcategory: this._id }
    ]
  });
  return count > 0;
};

// Update product count
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const subcategories = await this.getAllSubcategories();
  
  const count = await Product.countDocuments({
    $or: [
      { category: this._id },
      { category: { $in: subcategories } },
      { subcategory: this._id },
      { subcategory: { $in: subcategories } }
    ],
    status: 'active'
  });
  
  this.productCount = count;
  await this.save();
};

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ status: 1 });
categorySchema.index({ featured: 1 });
categorySchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
