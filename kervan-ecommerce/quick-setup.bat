@echo off
title KERVAN E-commerce - Quick Setup

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    KERVAN E-COMMERCE                        ║
echo ║                   Quick Setup Script                        ║
echo ║                                                              ║
echo ║  This will install dependencies and create basic config     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo [2/5] Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

echo.
echo [3/5] Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend dependencies installed

echo.
echo [4/5] Creating directories...
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads
if not exist "uploads\products" mkdir uploads\products
if not exist "uploads\categories" mkdir uploads\categories
if not exist "uploads\users" mkdir uploads\users
echo ✅ Directories created

echo.
echo [5/5] Creating environment file...
if not exist ".env" (
    echo # KERVAN E-commerce Platform - Environment Configuration > .env
    echo # Quick setup - Edit these values as needed >> .env
    echo. >> .env
    echo # Server Configuration >> .env
    echo PORT=5000 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # Database Configuration >> .env
    echo MONGODB_URI=mongodb://localhost:27017/kervan-ecommerce >> .env
    echo. >> .env
    echo # JWT Configuration >> .env
    echo JWT_SECRET=%RANDOM%%RANDOM%%RANDOM%%RANDOM%SuperSecretKey >> .env
    echo JWT_EXPIRES_IN=7d >> .env
    echo. >> .env
    echo # Email Configuration ^(Configure for email features^) >> .env
    echo EMAIL_USER= >> .env
    echo EMAIL_PASS= >> .env
    echo EMAIL_FROM=noreply@kervan.com >> .env
    echo. >> .env
    echo # Frontend Configuration >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
    echo. >> .env
    echo # Admin Configuration >> .env
    echo ADMIN_EMAIL=admin@kervan.com >> .env
    echo ADMIN_PASSWORD=admin123 >> .env
    echo. >> .env
    echo # File Upload >> .env
    echo MAX_FILE_SIZE=5000000 >> .env
    echo. >> .env
    echo # Security >> .env
    echo BCRYPT_SALT_ROUNDS=12 >> .env
    echo RATE_LIMIT_WINDOW_MS=900000 >> .env
    echo RATE_LIMIT_MAX_REQUESTS=100 >> .env
    echo ✅ Environment file created
) else (
    echo ⚠️  Environment file already exists
)

echo.
echo 🎉 Setup Complete!
echo.
echo 📊 Configuration:
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:3000
echo    Database: mongodb://localhost:27017/kervan-ecommerce
echo.
echo 🚀 To start the application:
echo    npm run dev    - Start both backend and frontend
echo    npm start      - Start backend only
echo.
echo 📝 Next steps:
echo    1. Edit .env file with your email credentials
echo    2. Make sure MongoDB is running
echo    3. Run: npm run dev
echo.
echo Press any key to exit...
pause >nul
