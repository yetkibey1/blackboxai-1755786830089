# KERVAN - Complete Wholesale E-commerce Platform

A full-stack e-commerce platform built with Node.js, Express, React, and MongoDB, designed specifically for wholesale businesses.

## 🚀 Features

### Backend Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Customer, Admin, Manager)
  - Password reset functionality
  - Email verification
  - Secure password hashing with bcrypt

- **Product Management**
  - Product CRUD operations
  - Category management
  - Image upload and management
  - Inventory tracking
  - Product search and filtering

- **Order Management**
  - Order processing
  - Order status tracking
  - Order history
  - Invoice generation

- **User Management**
  - User profiles
  - Address management
  - User preferences (language, currency)
  - Notification settings

- **Security Features**
  - Rate limiting
  - Helmet for security headers
  - Input validation and sanitization
  - CORS configuration

### Frontend Features
- **Responsive Design**
  - Mobile-first approach
  - Modern UI/UX
  - Multi-language support (Georgian, English, Turkish)

- **Admin Dashboard**
  - Product management interface
  - Order management
  - User management
  - Analytics and reporting

- **Customer Features**
  - Product browsing and search
  - Shopping cart functionality
  - Order placement and tracking
  - User account management

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Email:** Nodemailer
- **Security:** Helmet, bcryptjs, express-rate-limit
- **Validation:** express-validator

### Frontend
- **Framework:** React.js
- **Build Tool:** Create React App
- **Styling:** CSS3, Responsive Design
- **State Management:** React Context API
- **HTTP Client:** Axios (assumed)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kervan-ecommerce.git
   cd kervan-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/kervan-ecommerce

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   EMAIL_FROM=noreply@kervan.com

   # Frontend URL (for email links)
   FRONTEND_URL=http://localhost:3000

   # File Upload
   MAX_FILE_SIZE=5000000
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install client dependencies**
   ```bash
   npm install
   ```

3. **Start the client**
   ```bash
   npm start
   ```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-email-password
FRONTEND_URL=https://your-domain.com
```

### Build for Production

```bash
# Build client
cd client
npm run build

# Start production server
cd ..
npm start
```

## 📁 Project Structure

```
kervan-ecommerce/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── ...
│   └── package.json
├── middleware/             # Express middleware
│   └── auth.js
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Settings.js
│   └── PasswordResetToken.js
├── routes/                 # API routes
│   └── auth.js
├── utils/                  # Utility functions
│   └── emailService.js
├── uploads/                # File uploads
├── scripts/                # Database scripts
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products (Coming Soon)
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders (Coming Soon)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## 🌍 Multi-language Support

The platform supports multiple languages:
- **Georgian (ka)** - Default
- **English (en)**
- **Turkish (tr)**

## 💰 Currency Support

- **GEL** (Georgian Lari) - Default
- Additional currencies can be configured

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- File upload restrictions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **KERVAN Team** - *Initial work*

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this platform
- Special thanks to the open-source community for the amazing tools and libraries

## 📞 Support

For support, email support@kervan.com or create an issue in this repository.

## 🔄 Version History

- **1.0.0** - Initial release with core e-commerce functionality

---

**Made with ❤️ by the KERVAN Team**
