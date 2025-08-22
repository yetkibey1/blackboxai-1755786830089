# 🚀 KERVAN E-commerce Platform - Setup Guide

This guide provides multiple ways to set up the KERVAN e-commerce platform quickly and easily.

## 📋 Prerequisites

Before running any setup script, ensure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

## 🎯 Quick Setup Options

### Option 1: Interactive Setup (Recommended)

The interactive setup script will guide you through all configuration options:

```bash
# Run the interactive setup
node setup.js
```

**Features:**
- ✅ Interactive configuration wizard
- ✅ Automatic dependency installation
- ✅ Environment file generation
- ✅ Directory structure creation
- ✅ Startup scripts generation
- ✅ Prerequisites checking
- ✅ Optional services configuration (Stripe, AWS, Redis)

### Option 2: Quick Setup Scripts

For a fast setup with default configurations:

**Windows:**
```cmd
quick-setup.bat
```

**Linux/Mac:**
```bash
chmod +x quick-setup.sh
./quick-setup.sh
```

**Features:**
- ✅ Automatic dependency installation
- ✅ Basic environment file creation
- ✅ Directory structure creation
- ✅ MongoDB connectivity check

### Option 3: Manual Setup

If you prefer to set up manually:

1. **Install Dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Create Environment File:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Create Directories:**
   ```bash
   mkdir -p logs uploads/{products,categories,users,temp}
   ```

4. **Start the Application:**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration Options

### Environment Variables

Edit the `.env` file to configure your application:

#### Required Configuration
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kervan-ecommerce

# Security
JWT_SECRET=your-super-secret-jwt-key

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### Email Configuration (Optional but recommended)
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@kervan.com
```

#### Admin Account
```env
ADMIN_EMAIL=admin@kervan.com
ADMIN_PASSWORD=admin123
```

### Configuration File

You can also modify `config.json` for advanced settings:

```json
{
  "server": {
    "port": 5000,
    "environment": "development"
  },
  "database": {
    "mongodb_uri": "mongodb://localhost:27017/kervan-ecommerce"
  },
  "features": {
    "email_verification": true,
    "multi_language": true,
    "supported_languages": ["ka", "en", "tr"]
  }
}
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB:**
   - [MongoDB Community Server](https://www.mongodb.com/try/download/community)

2. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   # or
   brew services start mongodb/brew/mongodb-community
   ```

3. **Verify Connection:**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account:** [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster:** Follow the setup wizard
3. **Get Connection String:** Replace in `.env` file
4. **Whitelist IP:** Add your IP address to access list

Example Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kervan-ecommerce?retryWrites=true&w=majority
```

## 📧 Email Configuration

### Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Other Email Providers

Update `utils/emailService.js` for other providers:

```javascript
// For Outlook/Hotmail
service: 'hotmail'

// For Yahoo
service: 'yahoo'

// For custom SMTP
host: 'smtp.your-provider.com',
port: 587,
secure: false
```

## 🚀 Starting the Application

### Development Mode

```bash
# Start both backend and frontend
npm run dev

# Start backend only
npm start

# Start frontend only
npm run client
```

### Production Mode

```bash
# Build frontend
cd client && npm run build && cd ..

# Set environment
export NODE_ENV=production

# Start server
npm start
```

### Using Docker

```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   
   # Or change port in .env
   PORT=5001
   ```

2. **MongoDB Connection Error:**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check firewall settings

3. **Email Not Working:**
   - Verify email credentials
   - Check app password (not regular password)
   - Ensure 2FA is enabled for Gmail

4. **Frontend Not Loading:**
   - Check if both servers are running
   - Verify FRONTEND_URL in `.env`
   - Clear browser cache

### Getting Help

1. **Check Logs:**
   ```bash
   # View application logs
   tail -f logs/app.log
   
   # View server console
   npm run dev
   ```

2. **Verify Configuration:**
   ```bash
   # Test API endpoint
   curl http://localhost:5000/api/health
   
   # Check environment
   node -e "console.log(process.env.NODE_ENV)"
   ```

## 📁 Project Structure

```
kervan-ecommerce/
├── client/                 # React frontend
├── models/                 # Database models
├── routes/                 # API routes
├── middleware/             # Express middleware
├── utils/                  # Utility functions
├── uploads/                # File uploads
├── logs/                   # Application logs
├── setup.js               # Interactive setup script
├── quick-setup.sh         # Unix quick setup
├── quick-setup.bat        # Windows quick setup
├── config.json            # Configuration file
├── .env.example           # Environment template
└── README.md              # Project documentation
```

## 🌐 API Endpoints

Once running, access these endpoints:

- **API Info:** http://localhost:5000/
- **Health Check:** http://localhost:5000/api/health
- **Authentication:** http://localhost:5000/api/auth
- **Products:** http://localhost:5000/api/products
- **Admin Panel:** http://localhost:3000/admin

## 🔒 Security Notes

1. **Change Default Passwords:**
   - Update `ADMIN_PASSWORD` in `.env`
   - Use strong JWT secret

2. **Environment Variables:**
   - Never commit `.env` to version control
   - Use different secrets for production

3. **Database Security:**
   - Enable authentication in production
   - Use connection string with credentials

## 📞 Support

If you encounter issues:

1. Check this setup guide
2. Review the main [README.md](README.md)
3. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. Create an issue on GitHub

---

**Happy coding! 🚀**
