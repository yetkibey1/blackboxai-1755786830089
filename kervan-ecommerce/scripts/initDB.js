const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
require('dotenv').config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${colors.bright}🚀 ${msg}${colors.reset}\n`)
};

async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kervan-ecommerce';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log.success('Connected to MongoDB');
    return true;
  } catch (error) {
    log.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kervan.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      log.warning(`Admin user already exists: ${adminEmail}`);
      return existingAdmin;
    }

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: adminPassword,
      phone: '+995555000000',
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      address: {
        street: 'Admin Street 1',
        city: 'Tbilisi',
        state: 'Tbilisi',
        zipCode: '0100',
        country: 'Georgia'
      },
      preferences: {
        language: 'en',
        currency: 'GEL',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    });

    await adminUser.save();
    log.success(`Admin user created: ${adminEmail}`);
    log.info(`Admin password: ${adminPassword}`);
    return adminUser;
  } catch (error) {
    log.error(`Failed to create admin user: ${error.message}`);
    throw error;
  }
}

async function createDefaultCategories() {
  try {
    const categories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        isActive: true
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing',
        isActive: true
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        slug: 'home-garden',
        isActive: true
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
        slug: 'sports-outdoors',
        isActive: true
      },
      {
        name: 'Books & Media',
        description: 'Books, movies, music, and games',
        slug: 'books-media',
        isActive: true
      }
    ];

    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      log.warning('Categories already exist, skipping creation');
      return;
    }

    for (const categoryData of categories) {
      const category = new Category(categoryData);
      await category.save();
      log.success(`Created category: ${categoryData.name}`);
    }
  } catch (error) {
    log.error(`Failed to create categories: ${error.message}`);
    throw error;
  }
}

async function createSampleProducts() {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      log.warning('Products already exist, skipping creation');
      return;
    }

    const categories = await Category.find();
    if (categories.length === 0) {
      log.warning('No categories found, skipping product creation');
      return;
    }

    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        category: categories[0]._id, // Electronics
        sku: 'WBH-001',
        stockQuantity: 50,
        minOrderQuantity: 1,
        isActive: true,
        specifications: {
          'Brand': 'KERVAN Audio',
          'Battery Life': '30 hours',
          'Connectivity': 'Bluetooth 5.0',
          'Weight': '250g'
        }
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt available in multiple colors',
        price: 19.99,
        category: categories[1]._id, // Clothing
        sku: 'CTS-001',
        stockQuantity: 100,
        minOrderQuantity: 5,
        isActive: true,
        specifications: {
          'Material': '100% Cotton',
          'Sizes': 'S, M, L, XL, XXL',
          'Colors': 'White, Black, Blue, Red',
          'Care': 'Machine washable'
        }
      },
      {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with touch controls',
        price: 45.99,
        category: categories[2]._id, // Home & Garden
        sku: 'LDL-001',
        stockQuantity: 30,
        minOrderQuantity: 2,
        isActive: true,
        specifications: {
          'Power': '12W LED',
          'Brightness': '3 levels',
          'Color Temperature': '3000K-6500K',
          'USB Charging': 'Yes'
        }
      }
    ];

    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
      log.success(`Created product: ${productData.name}`);
    }
  } catch (error) {
    log.error(`Failed to create sample products: ${error.message}`);
    throw error;
  }
}

async function createSystemSettings() {
  try {
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      log.warning('System settings already exist, skipping creation');
      return;
    }

    const settings = new Settings({
      siteName: 'KERVAN E-commerce',
      siteDescription: 'Complete wholesale e-commerce platform',
      contactEmail: process.env.EMAIL_USER || 'contact@kervan.com',
      supportEmail: process.env.EMAIL_USER || 'support@kervan.com',
      currency: 'GEL',
      language: 'ka',
      timezone: 'Asia/Tbilisi',
      taxRate: 18, // Georgia VAT rate
      shippingSettings: {
        freeShippingThreshold: 100,
        standardShippingCost: 5.99,
        expressShippingCost: 12.99
      },
      paymentMethods: {
        creditCard: true,
        bankTransfer: true,
        cashOnDelivery: true
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: ''
      }
    });

    await settings.save();
    log.success('System settings created');
  } catch (error) {
    log.error(`Failed to create system settings: ${error.message}`);
    throw error;
  }
}

async function initializeDatabase() {
  log.title('Initializing KERVAN E-commerce Database');

  try {
    // Connect to database
    const connected = await connectDatabase();
    if (!connected) {
      process.exit(1);
    }

    // Create admin user
    await createAdminUser();

    // Create default categories
    await createDefaultCategories();

    // Create sample products
    await createSampleProducts();

    // Create system settings
    await createSystemSettings();

    log.title('Database Initialization Complete!');
    
    console.log(`${colors.green}🎉 Database initialized successfully!${colors.reset}\n`);
    
    console.log(`${colors.bright}📊 What was created:${colors.reset}`);
    console.log(`   ✅ Admin user: ${process.env.ADMIN_EMAIL || 'admin@kervan.com'}`);
    console.log(`   ✅ Default categories (5)`);
    console.log(`   ✅ Sample products (3)`);
    console.log(`   ✅ System settings\n`);
    
    console.log(`${colors.bright}🔑 Admin Login:${colors.reset}`);
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@kervan.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}\n`);
    
    console.log(`${colors.bright}🌐 Access Points:${colors.reset}`);
    console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`   Backend API: http://localhost:${process.env.PORT || 5000}`);
    console.log(`   Admin Panel: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin\n`);

  } catch (error) {
    log.error(`Database initialization failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    log.info('Disconnected from MongoDB');
  }
}

// Run initialization if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, createAdminUser };
