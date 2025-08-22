#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_title() {
    echo -e "${CYAN}$1${NC}"
}

# Generate random JWT secret
generate_jwt_secret() {
    openssl rand -base64 64 2>/dev/null || head -c 64 /dev/urandom | base64 | tr -d '\n'
}

clear
print_title "╔══════════════════════════════════════════════════════════════╗"
print_title "║                    KERVAN E-COMMERCE                        ║"
print_title "║                   Quick Setup Script                        ║"
print_title "║                                                              ║"
print_title "║  This will install dependencies and create basic config     ║"
print_title "╚══════════════════════════════════════════════════════════════╝"
echo

# Check if Node.js is installed
echo "[1/5] Checking Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    echo "       Download from: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js is installed: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm is installed: $NPM_VERSION"

echo
echo "[2/5] Installing backend dependencies..."
if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

echo
echo "[3/5] Installing frontend dependencies..."
if cd client && npm install && cd ..; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

echo
echo "[4/5] Creating directories..."
mkdir -p logs
mkdir -p uploads/{products,categories,users,temp}
print_success "Directories created"

echo
echo "[5/5] Creating environment file..."
if [ ! -f ".env" ]; then
    JWT_SECRET=$(generate_jwt_secret)
    cat > .env << EOF
# KERVAN E-commerce Platform - Environment Configuration
# Quick setup - Edit these values as needed

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/kervan-ecommerce

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# Email Configuration (Configure for email features)
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@kervan.com

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@kervan.com
ADMIN_PASSWORD=admin123

# File Upload
MAX_FILE_SIZE=5000000

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
EOF
    print_success "Environment file created"
else
    print_warning "Environment file already exists"
fi

# Make scripts executable
chmod +x setup.js 2>/dev/null || true
chmod +x quick-setup.sh 2>/dev/null || true

echo
print_title "🎉 Setup Complete!"
echo
print_info "📊 Configuration:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo "   Database: mongodb://localhost:27017/kervan-ecommerce"
echo
print_info "🚀 To start the application:"
echo "   npm run dev    - Start both backend and frontend"
echo "   npm start      - Start backend only"
echo
print_info "📝 Next steps:"
echo "   1. Edit .env file with your email credentials"
echo "   2. Make sure MongoDB is running"
echo "   3. Run: npm run dev"
echo
print_info "🔧 Advanced setup:"
echo "   node setup.js  - Interactive setup with more options"
echo

# Check if MongoDB is running
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand({ping: 1})" --quiet &> /dev/null; then
        print_success "MongoDB is running and accessible"
    else
        print_warning "MongoDB is not running. Start MongoDB or use MongoDB Atlas"
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "db.runCommand({ping: 1})" --quiet &> /dev/null; then
        print_success "MongoDB is running and accessible"
    else
        print_warning "MongoDB is not running. Start MongoDB or use MongoDB Atlas"
    fi
else
    print_warning "MongoDB client not found. Install MongoDB or use MongoDB Atlas"
fi

echo
print_title "Ready to go! 🚀"
