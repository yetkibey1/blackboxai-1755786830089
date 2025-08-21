const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Site Information
  site: {
    name: {
      ka: { type: String, default: 'კერვანი' },
      en: { type: String, default: 'KERVAN' },
      tr: { type: String, default: 'KERVAN' }
    },
    tagline: {
      ka: { type: String, default: 'საბითუმო შეფუთვის გაყიდვები' },
      en: { type: String, default: 'Wholesale Packaging Sales' },
      tr: { type: String, default: 'Toptan Ambalaj Satışları' }
    },
    description: {
      ka: String,
      en: String,
      tr: String
    },
    logo: {
      url: String,
      alt: String
    },
    favicon: String,
    defaultLanguage: {
      type: String,
      enum: ['ka', 'en', 'tr'],
      default: 'ka'
    },
    availableLanguages: [{
      code: String,
      name: String,
      flag: String,
      enabled: { type: Boolean, default: true }
    }],
    currency: {
      primary: { type: String, default: 'GEL' },
      symbol: { type: String, default: '₾' },
      supported: [String]
    }
  },

  // Contact Information
  contact: {
    address: {
      ka: String,
      en: String,
      tr: String
    },
    phone: {
      primary: String,
      secondary: String,
      whatsapp: String,
      telegram: String
    },
    email: {
      primary: String,
      support: String,
      orders: String,
      admin: String
    },
    workingHours: {
      ka: String,
      en: String,
      tr: String
    },
    location: {
      latitude: Number,
      longitude: Number,
      googleMapsUrl: String,
      address: String
    }
  },

  // Social Media
  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String,
    tiktok: String
  },

  // Homepage Settings
  homepage: {
    hero: {
      slides: [{
        title: {
          ka: String,
          en: String,
          tr: String
        },
        subtitle: {
          ka: String,
          en: String,
          tr: String
        },
        image: String,
        buttonText: {
          ka: String,
          en: String,
          tr: String
        },
        buttonLink: String,
        active: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
      }]
    },
    featuredCategories: {
      enabled: { type: Boolean, default: true },
      title: {
        ka: String,
        en: String,
        tr: String
      },
      maxItems: { type: Number, default: 8 }
    },
    featuredProducts: {
      enabled: { type: Boolean, default: true },
      title: {
        ka: String,
        en: String,
        tr: String
      },
      maxItems: { type: Number, default: 12 }
    },
    benefits: [{
      icon: String,
      title: {
        ka: String,
        en: String,
        tr: String
      },
      description: {
        ka: String,
        en: String,
        tr: String
      },
      active: { type: Boolean, default: true }
    }]
  },

  // E-commerce Settings
  ecommerce: {
    inventory: {
      trackStock: { type: Boolean, default: true },
      allowBackorders: { type: Boolean, default: false },
      lowStockThreshold: { type: Number, default: 10 }
    },
    pricing: {
      includeTax: { type: Boolean, default: true },
      taxRate: { type: Number, default: 0 },
      showPricesWithTax: { type: Boolean, default: true }
    },
    orders: {
      requireRegistration: { type: Boolean, default: false },
      allowGuestCheckout: { type: Boolean, default: true },
      autoConfirmOrders: { type: Boolean, default: false },
      orderNumberPrefix: { type: String, default: 'KRV' }
    },
    cart: {
      persistCart: { type: Boolean, default: true },
      cartExpiration: { type: Number, default: 30 }, // days
      minOrderAmount: { type: Number, default: 0 }
    }
  },

  // Payment Settings
  payment: {
    methods: [{
      name: String,
      displayName: {
        ka: String,
        en: String,
        tr: String
      },
      enabled: { type: Boolean, default: false },
      settings: mongoose.Schema.Types.Mixed
    }],
    tbcBank: {
      enabled: { type: Boolean, default: false },
      merchantId: String,
      apiKey: String,
      secretKey: String,
      testMode: { type: Boolean, default: true }
    },
    bankTransfer: {
      enabled: { type: Boolean, default: true },
      bankDetails: {
        bankName: String,
        accountNumber: String,
        accountHolder: String,
        iban: String,
        swift: String
      },
      instructions: {
        ka: String,
        en: String,
        tr: String
      }
    }
  },

  // Shipping Settings
  shipping: {
    methods: [{
      name: String,
      displayName: {
        ka: String,
        en: String,
        tr: String
      },
      cost: Number,
      estimatedDays: String,
      enabled: { type: Boolean, default: true }
    }],
    freeShippingThreshold: { type: Number, default: 0 },
    courierApis: [{
      name: String,
      apiKey: String,
      apiUrl: String,
      enabled: { type: Boolean, default: false }
    }]
  },

  // Email Settings
  email: {
    smtp: {
      host: String,
      port: Number,
      secure: { type: Boolean, default: true },
      username: String,
      password: String
    },
    templates: {
      orderConfirmation: {
        enabled: { type: Boolean, default: true },
        subject: {
          ka: String,
          en: String,
          tr: String
        }
      },
      orderStatusUpdate: {
        enabled: { type: Boolean, default: true },
        subject: {
          ka: String,
          en: String,
          tr: String
        }
      },
      welcomeEmail: {
        enabled: { type: Boolean, default: true },
        subject: {
          ka: String,
          en: String,
          tr: String
        }
      }
    }
  },

  // SEO Settings
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
    keywords: [String],
    googleAnalytics: String,
    googleTagManager: String,
    facebookPixel: String,
    structuredData: {
      organization: mongoose.Schema.Types.Mixed,
      website: mongoose.Schema.Types.Mixed
    }
  },

  // Security Settings
  security: {
    rateLimit: {
      windowMs: { type: Number, default: 900000 }, // 15 minutes
      max: { type: Number, default: 100 }
    },
    cors: {
      origins: [String],
      credentials: { type: Boolean, default: true }
    },
    jwt: {
      expiresIn: { type: String, default: '7d' },
      refreshExpiresIn: { type: String, default: '30d' }
    }
  },

  // Maintenance
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: {
      ka: String,
      en: String,
      tr: String
    },
    allowedIPs: [String],
    estimatedTime: String
  },

  // System Settings
  system: {
    version: { type: String, default: '1.0.0' },
    lastBackup: Date,
    backupFrequency: { type: String, default: 'daily' },
    logLevel: {
      type: String,
      enum: ['error', 'warn', 'info', 'debug'],
      default: 'info'
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Update specific setting
settingsSchema.methods.updateSetting = function(path, value) {
  this.set(path, value);
  return this.save();
};

// Get public settings (safe for frontend)
settingsSchema.methods.getPublicSettings = function() {
  return {
    site: this.site,
    contact: {
      address: this.contact.address,
      phone: {
        primary: this.contact.phone.primary,
        whatsapp: this.contact.phone.whatsapp,
        telegram: this.contact.phone.telegram
      },
      email: {
        primary: this.contact.email.primary,
        support: this.contact.email.support
      },
      workingHours: this.contact.workingHours,
      location: this.contact.location
    },
    social: this.social,
    homepage: this.homepage,
    ecommerce: {
      inventory: {
        trackStock: this.ecommerce.inventory.trackStock,
        allowBackorders: this.ecommerce.inventory.allowBackorders
      },
      pricing: this.ecommerce.pricing,
      orders: {
        requireRegistration: this.ecommerce.orders.requireRegistration,
        allowGuestCheckout: this.ecommerce.orders.allowGuestCheckout,
        minOrderAmount: this.ecommerce.cart.minOrderAmount
      }
    },
    payment: {
      methods: this.payment.methods.filter(method => method.enabled)
        .map(method => ({
          name: method.name,
          displayName: method.displayName
        }))
    },
    shipping: {
      methods: this.shipping.methods.filter(method => method.enabled),
      freeShippingThreshold: this.shipping.freeShippingThreshold
    },
    seo: this.seo,
    maintenance: this.maintenance
  };
};

module.exports = mongoose.model('Settings', settingsSchema);
