# KERVAN E-commerce Platform

A comprehensive wholesale e-commerce platform built with Node.js, Express, MongoDB, and React. Features multilingual support, advanced product filtering, pagination, and a modern responsive design.

## 🚀 Features

### Backend Features
- **Multilingual Support**: Products and categories support Georgian (ka), English (en), and Turkish (tr)
- **Advanced Product Management**: Complex pricing structure with quantity discounts
- **Robust API**: RESTful API with comprehensive filtering and pagination
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, input validation, and secure password hashing

### Frontend Features
- **Modern React UI**: Clean, responsive design with Tailwind-inspired CSS
- **Advanced Filtering**: Search, category, price range, and sorting options
- **Real-time Cart**: Persistent shopping cart with localStorage
- **Product Management**: Detailed product pages with specifications and images
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox

### Product Features
- **Multilingual Names & Descriptions**: Support for 3 languages
- **Complex Pricing**: Multiple price tiers and quantity-based discounts
- **Inventory Management**: Stock tracking with low-stock alerts
- **Product Specifications**: Detailed technical specifications
- **SEO Optimization**: Meta titles, descriptions, and keywords
- **Product Relations**: Related products and cross-selling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kervan-ecommerce
   ```

2. **Run the quick setup script**
   
   **For Unix/Linux/macOS:**
   ```bash
   chmod +x quick-setup.sh
   ./quick-setup.sh
   ```
   
   **For Windows:**
   ```cmd
   quick-setup.bat
   ```

### Manual Setup

1. **Install backend dependencies**
   ```bash
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kervan-ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_EMAIL=admin@kervan.com
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=http://localhost:3000
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start the application**
   
   **Development mode (both backend and frontend):**
   ```bash
   npm run dev
   ```
   
   **Or start separately:**
   ```bash
   # Backend
   npm start
   
   # Frontend (in another terminal)
   cd client
   npm start
   ```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/:id` - Get single product by ID or slug
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## 🎯 Product Filtering & Search

The platform supports advanced product filtering:

### Query Parameters
- `search` - Search in product names, descriptions, and codes
- `category` - Filter by category ID
- `minPrice` / `maxPrice` - Price range filtering
- `sort` - Sort options: `newest`, `oldest`, `name_asc`, `name_desc`, `price_asc`, `price_desc`, `featured`
- `page` - Page number for pagination
- `limit` - Items per page (default: 12)
- `status` - Product status filter (default: 'active')
- `featured` - Filter featured products
- `tags` - Filter by product tags

### Example API Calls
```javascript
// Search for wireless headphones under 100 GEL
GET /api/products?search=wireless&maxPrice=100&sort=price_asc

// Get featured electronics, page 2
GET /api/products?category=electronics_category_id&featured=true&page=2

// Search with multiple filters
GET /api/products?search=cotton&minPrice=10&maxPrice=50&sort=newest&limit=20
```

## 🗄️ Database Schema

### Product Schema
```javascript
{
  name: {
    en: String,    // English name
    ka: String,    // Georgian name
    tr: String     // Turkish name
  },
  description: {
    en: String,
    ka: String,
    tr: String
  },
  code: String,           // Unique product code
  barcode: String,        // Product barcode
  slug: String,           // URL-friendly identifier
  category: ObjectId,     // Reference to Category
  pricing: {
    price1: Number,       // Primary price
    price2: Number,       // Secondary price
    price3: Number,       // Tertiary price
    activePrice: String,  // Which price is active
    currency: String      // Currency (default: GEL)
  },
  quantityDiscounts: [{
    minQuantity: Number,
    maxQuantity: Number,
    price: Number
  }],
  inventory: {
    stock: Number,
    minStockLevel: Number,
    trackInventory: Boolean
  },
  specifications: Object, // Flexible specifications
  status: String,         // active, inactive, out_of_stock
  featured: Boolean,
  tags: [String],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }]
}
```

### Category Schema
```javascript
{
  name: {
    en: String,
    ka: String,
    tr: String
  },
  description: {
    en: String,
    ka: String,
    tr: String
  },
  slug: String,
  parent: ObjectId,       // For hierarchical categories
  status: String,
  featured: Boolean,
  sortOrder: Number
}
```

## 🎨 Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.js
│   │   └── Footer.js
│   └── Admin/
├── contexts/
│   ├── AuthContext.js
│   └── CartContext.js
├── pages/
│   ├── Products.js      # Product listing with filters
│   ├── ProductDetail.js # Individual product page
│   ├── Cart.js          # Shopping cart
│   ├── Home.js
│   └── Auth/
├── services/
│   └── api.js           # API service layer
└── App.js
```

### State Management
- **AuthContext**: User authentication state
- **CartContext**: Shopping cart state with localStorage persistence
- **API Service**: Centralized API calls with error handling

## 🔐 Authentication & Authorization

### User Roles
- **Customer**: Can browse products, manage cart, place orders
- **Manager**: Can manage products and categories
- **Admin**: Full system access including user management

### Default Admin Account
- **Email**: admin@kervan.com
- **Password**: admin123 (change in production!)

## 🌐 Multilingual Support

The platform supports three languages:
- **Georgian (ka)**: Primary language
- **English (en)**: International language
- **Turkish (tr)**: Regional language

Products and categories automatically fall back to available languages when displaying content.

## 📱 Responsive Design

The platform is fully responsive with:
- **Mobile-first approach**
- **CSS Grid and Flexbox layouts**
- **Touch-friendly interfaces**
- **Optimized for all screen sizes**

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
FRONTEND_URL=https://yourdomain.com
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start both backend and frontend
npm start           # Start backend only
npm run client      # Start frontend only

# Database
npm run init-db     # Initialize database with sample data

# Production
npm run build       # Build frontend for production
npm run start:prod  # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@kervan.com

## 🔄 Recent Updates

### Version 2.0.0 - Enhanced Product Management
- ✅ **Fixed multilingual product schema compatibility**
- ✅ **Enhanced API with advanced filtering and pagination**
- ✅ **Improved frontend with real API integration**
- ✅ **Added comprehensive product specifications**
- ✅ **Implemented quantity-based pricing and discounts**
- ✅ **Enhanced cart functionality with proper currency support**
- ✅ **Added responsive design improvements**
- ✅ **Updated database initialization with sample data**
- ✅ **Improved error handling and user feedback**
- ✅ **Added breadcrumb navigation and SEO optimization**

### Key Improvements Made:
1. **Backend API Fixes**: Updated product and category routes to handle multilingual schema
2. **Frontend Integration**: Connected React components to real backend APIs
3. **Enhanced Filtering**: Advanced search, category, price, and sorting options
4. **Better UX**: Loading states, error handling, and responsive design
5. **Cart Improvements**: Proper currency display and product information
6. **Database Schema**: Comprehensive multilingual support with proper relationships

---

**Built with ❤️ by the KERVAN Team**
