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
    const adminUser = await User.findOne({ role: 'admin' });
    
    const categories = [
      {
        name: {
          en: 'Electronics',
          ka: 'ელექტრონიკა',
          tr: 'Elektronik'
        },
        description: {
          en: 'Electronic devices and accessories',
          ka: 'ელექტრონული მოწყობილობები და აქსესუარები',
          tr: 'Elektronik cihazlar ve aksesuarlar'
        },
        slug: 'electronics',
        status: 'active',
        featured: true,
        sortOrder: 1,
        createdBy: adminUser._id
      },
      {
        name: {
          en: 'Clothing & Fashion',
          ka: 'ტანსაცმელი და მოდა',
          tr: 'Giyim ve Moda'
        },
        description: {
          en: 'Fashion and apparel for all occasions',
          ka: 'მოდა და ტანსაცმელი ყველა შემთხვევისთვის',
          tr: 'Her durum için moda ve giyim'
        },
        slug: 'clothing-fashion',
        status: 'active',
        featured: true,
        sortOrder: 2,
        createdBy: adminUser._id
      },
      {
        name: {
          en: 'Home & Garden',
          ka: 'სახლი და ბაღი',
          tr: 'Ev ve Bahçe'
        },
        description: {
          en: 'Home improvement and garden supplies',
          ka: 'სახლის გაუმჯობესება და ბაღის მარაგები',
          tr: 'Ev geliştirme ve bahçe malzemeleri'
        },
        slug: 'home-garden',
        status: 'active',
        featured: false,
        sortOrder: 3,
        createdBy: adminUser._id
      },
      {
        name: {
          en: 'Sports & Outdoors',
          ka: 'სპორტი და გარე აქტივობები',
          tr: 'Spor ve Açık Hava'
        },
        description: {
          en: 'Sports equipment and outdoor gear',
          ka: 'სპორტული აღჭურვილობა და გარე აღჭურვილობა',
          tr: 'Spor ekipmanları ve açık hava malzemeleri'
        },
        slug: 'sports-outdoors',
        status: 'active',
        featured: false,
        sortOrder: 4,
        createdBy: adminUser._id
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
      log.success(`Created category: ${categoryData.name.en}`);
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
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (categories.length === 0) {
      log.warning('No categories found, skipping product creation');
      return;
    }

    // Get categories by slug
    const electronicsCategory = categories.find(cat => cat.slug === 'electronics');
    const clothingCategory = categories.find(cat => cat.slug === 'clothing-fashion');
    const homeCategory = categories.find(cat => cat.slug === 'home-garden');
    const sportsCategory = categories.find(cat => cat.slug === 'sports-outdoors');

    const sampleProducts = [
      {
        name: {
          en: 'Wireless Bluetooth Headphones',
          ka: 'უსადენო ბლუთუზ ყურსასმენები',
          tr: 'Kablosuz Bluetooth Kulaklık'
        },
        description: {
          en: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life',
          ka: 'მაღალი ხარისხის უსადენო ყურსასმენები აქტიური ხმაურის გაუქმებით და 30 საათიანი ბატარეით',
          tr: 'Aktif gürültü önleme ve 30 saatlik pil ömrü ile yüksek kaliteli kablosuz kulaklık'
        },
        code: 'WBH001',
        barcode: '1234567890123',
        category: electronicsCategory._id,
        pricing: {
          price1: 99.99,
          price2: 89.99,
          price3: 79.99,
          activePrice: 'price1',
          currency: 'GEL'
        },
        inventory: {
          stock: 50,
          minStockLevel: 10,
          unit: 'pcs',
          trackInventory: true
        },
        specifications: {
          brand: 'KERVAN Audio',
          color: 'Black',
          weight: { value: 250, unit: 'g' },
          dimensions: { length: 18, width: 15, height: 8, unit: 'cm' }
        },
        status: 'active',
        featured: true,
        tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
        createdBy: adminUser._id
      },
      {
        name: {
          en: 'Premium Cotton T-Shirt',
          ka: 'პრემიუმ ბამბის მაისური',
          tr: 'Premium Pamuk T-Shirt'
        },
        description: {
          en: 'Comfortable 100% organic cotton t-shirt with modern fit and sustainable production',
          ka: 'კომფორტული 100% ორგანული ბამბის მაისური თანამედროვე ფიტით და მდგრადი წარმოებით',
          tr: 'Modern kesim ve sürdürülebilir üretim ile rahat %100 organik pamuk t-shirt'
        },
        code: 'PCT003',
        barcode: '1234567890125',
        category: clothingCategory._id,
        pricing: {
          price1: 19.99,
          price2: 17.99,
          price3: 15.99,
          activePrice: 'price1',
          currency: 'GEL'
        },
        quantityDiscounts: [
          { minQuantity: 10, maxQuantity: 49, price: 17.99 },
          { minQuantity: 50, price: 15.99 }
        ],
        inventory: {
          stock: 100,
          minStockLevel: 20,
          unit: 'pcs',
          trackInventory: true
        },
        specifications: {
          brand: 'KERVAN Fashion',
          material: '100% Organic Cotton',
          color: 'White'
        },
        status: 'active',
        featured: false,
        tags: ['cotton', 't-shirt', 'organic', 'fashion'],
        createdBy: adminUser._id
      },
      {
        name: {
          en: 'LED Desk Lamp',
          ka: 'LED მაგიდის ნათურა',
          tr: 'LED Masa Lambası'
        },
        description: {
          en: 'Adjustable LED desk lamp with touch control and USB charging port',
          ka: 'რეგულირებადი LED მაგიდის ნათურა სენსორული კონტროლით და USB დამტენი პორტით',
          tr: 'Dokunmatik kontrol ve USB şarj portu ile ayarlanabilir LED masa lambası'
        },
        code: 'LDL004',
        barcode: '1234567890126',
        category: homeCategory._id,
        pricing: {
          price1: 39.99,
          price2: 35.99,
          price3: 31.99,
          activePrice: 'price1',
          currency: 'GEL'
        },
        inventory: {
          stock: 25,
          minStockLevel: 5,
          unit: 'pcs',
          trackInventory: true
        },
        specifications: {
          brand: 'KERVAN Home',
          color: 'White',
          weight: { value: 800, unit: 'g' },
          dimensions: { length: 40, width: 20, height: 45, unit: 'cm' }
        },
        status: 'active',
        featured: false,
        tags: ['led', 'lamp', 'desk', 'home', 'office'],
        createdBy: adminUser._id
      },
      {
        name: {
          en: 'Yoga Mat Premium',
          ka: 'იოგას ხალიჩა პრემიუმ',
          tr: 'Premium Yoga Matı'
        },
        description: {
          en: 'Non-slip premium yoga mat made from eco-friendly materials with alignment guides',
          ka: 'არასრიალა პრემიუმ იოგას ხალიჩა ეკოლოგიურად სუფთა მასალებისგან შესწორების გიდებით',
          tr: 'Hizalama kılavuzları ile çevre dostu malzemelerden yapılmış kaymaz premium yoga matı'
        },
        code: 'YMP005',
        barcode: '1234567890127',
        category: sportsCategory._id,
        pricing: {
          price1: 29.99,
          price2: 26.99,
          price3: 23.99,
          activePrice: 'price1',
          currency: 'GEL'
        },
        inventory: {
          stock: 40,
          minStockLevel: 10,
          unit: 'pcs',
          trackInventory: true
        },
        specifications: {
          brand: 'KERVAN Sports',
          material: 'TPE (Thermoplastic Elastomer)',
          color: 'Purple',
          weight: { value: 1200, unit: 'g' },
          dimensions: { length: 183, width: 61, height: 0.6, unit: 'cm' }
        },
        status: 'active',
        featured: false,
        tags: ['yoga', 'mat', 'fitness', 'exercise', 'eco-friendly'],
        createdBy: adminUser._id
      }
    ];

    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
      log.success(`Created product: ${productData.name.en}`);
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
