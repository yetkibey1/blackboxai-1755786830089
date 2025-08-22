#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${colors.bright}🚀 ${msg}${colors.reset}\n`)
};

// Default configuration
const defaultConfig = {
  // Server Configuration
  PORT: '5000',
  NODE_ENV: 'development',
  
  // Database Configuration
  MONGODB_URI: 'mongodb://localhost:27017/kervan-ecommerce',
  
  // JWT Configuration
  JWT_SECRET: generateRandomString(64),
  JWT_EXPIRES_IN: '7d',
  
  // Email Configuration
  EMAIL_USER: '',
  EMAIL_PASS: '',
  EMAIL_FROM: 'noreply@kervan.com',
  
  // Frontend Configuration
  FRONTEND_URL: 'http://localhost:3000',
  
  // File Upload Configuration
  MAX_FILE_SIZE: '5000000',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100',
  
  // Security
  BCRYPT_SALT_ROUNDS: '12',
  
  // Admin Configuration
  ADMIN_EMAIL: 'admin@kervan.com',
  ADMIN_PASSWORD: 'admin123',
  
  // Optional: Payment Configuration
  STRIPE_SECRET_KEY: '',
  STRIPE_PUBLISHABLE_KEY: '',
  
  // Optional: AWS S3 Configuration
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',
  AWS_BUCKET_NAME: '',
  AWS_REGION: 'us-east-1',
  
  // Optional: Redis Configuration
  REDIS_URL: 'redis://localhost:6379',
  
  // Logging
  LOG_LEVEL: 'info',
  LOG_FILE: 'logs/app.log'
};

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function question(rl, query, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${query} (${defaultValue}): ` : `${query}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function checkPrerequisites() {
  log.title('Checking Prerequisites');
  
  const requirements = [
    { name: 'Node.js', command: 'node --version', minVersion: '14.0.0' },
    { name: 'npm', command: 'npm --version', minVersion: '6.0.0' }
  ];
  
  for (const req of requirements) {
    try {
      const version = execSync(req.command, { encoding: 'utf8' }).trim();
      log.success(`${req.name}: ${version}`);
    } catch (error) {
      log.error(`${req.name} is not installed or not in PATH`);
      process.exit(1);
    }
  }
  
  // Check if MongoDB is running (optional)
  try {
    execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { encoding: 'utf8' });
    log.success('MongoDB: Connected and running');
  } catch (error) {
    log.warning('MongoDB: Not running or not accessible (you can use MongoDB Atlas instead)');
  }
}

async function collectConfiguration() {
  log.title('Configuration Setup');
  
  const rl = createInterface();
  const config = { ...defaultConfig };
  
  log.info('Please provide configuration values (press Enter for defaults):');
  
  // Server Configuration
  console.log('\n📊 Server Configuration:');
  config.PORT = await question(rl, 'Server Port', config.PORT);
  config.NODE_ENV = await question(rl, 'Environment (development/production)', config.NODE_ENV);
  
  // Database Configuration
  console.log('\n🗄️ Database Configuration:');
  config.MONGODB_URI = await question(rl, 'MongoDB URI', config.MONGODB_URI);
  
  // JWT Configuration
  console.log('\n🔐 JWT Configuration:');
  const useDefaultJWT = await question(rl, 'Use auto-generated JWT secret? (y/n)', 'y');
  if (useDefaultJWT.toLowerCase() !== 'y') {
    config.JWT_SECRET = await question(rl, 'JWT Secret (64+ characters)');
  }
  
  // Email Configuration
  console.log('\n📧 Email Configuration:');
  config.EMAIL_USER = await question(rl, 'Email Username (Gmail)', config.EMAIL_USER);
  if (config.EMAIL_USER) {
    config.EMAIL_PASS = await question(rl, 'Email Password/App Password', config.EMAIL_PASS);
  }
  
  // Frontend Configuration
  console.log('\n🌐 Frontend Configuration:');
  config.FRONTEND_URL = await question(rl, 'Frontend URL', config.FRONTEND_URL);
  
  // Admin Configuration
  console.log('\n👤 Admin Configuration:');
  config.ADMIN_EMAIL = await question(rl, 'Admin Email', config.ADMIN_EMAIL);
  config.ADMIN_PASSWORD = await question(rl, 'Admin Password', config.ADMIN_PASSWORD);
  
  // Optional configurations
  const setupOptional = await question(rl, '\nSetup optional services (Stripe, AWS, Redis)? (y/n)', 'n');
  if (setupOptional.toLowerCase() === 'y') {
    console.log('\n💳 Payment Configuration (Stripe):');
    config.STRIPE_SECRET_KEY = await question(rl, 'Stripe Secret Key', config.STRIPE_SECRET_KEY);
    config.STRIPE_PUBLISHABLE_KEY = await question(rl, 'Stripe Publishable Key', config.STRIPE_PUBLISHABLE_KEY);
    
    console.log('\n☁️ AWS S3 Configuration:');
    config.AWS_ACCESS_KEY_ID = await question(rl, 'AWS Access Key ID', config.AWS_ACCESS_KEY_ID);
    config.AWS_SECRET_ACCESS_KEY = await question(rl, 'AWS Secret Access Key', config.AWS_SECRET_ACCESS_KEY);
    config.AWS_BUCKET_NAME = await question(rl, 'AWS S3 Bucket Name', config.AWS_BUCKET_NAME);
    
    console.log('\n🔴 Redis Configuration:');
    config.REDIS_URL = await question(rl, 'Redis URL', config.REDIS_URL);
  }
  
  rl.close();
  return config;
}

function createEnvFile(config) {
  log.title('Creating Environment File');
  
  let envContent = '# KERVAN E-commerce Platform - Environment Configuration\n';
  envContent += '# Generated automatically by setup script\n\n';
  
  const sections = {
    'Server Configuration': ['PORT', 'NODE_ENV'],
    'Database Configuration': ['MONGODB_URI'],
    'JWT Configuration': ['JWT_SECRET', 'JWT_EXPIRES_IN'],
    'Email Configuration': ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'],
    'Frontend Configuration': ['FRONTEND_URL'],
    'File Upload Configuration': ['MAX_FILE_SIZE'],
    'Rate Limiting': ['RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX_REQUESTS'],
    'Security': ['BCRYPT_SALT_ROUNDS'],
    'Admin Configuration': ['ADMIN_EMAIL', 'ADMIN_PASSWORD'],
    'Payment Configuration': ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY'],
    'AWS S3 Configuration': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME', 'AWS_REGION'],
    'Redis Configuration': ['REDIS_URL'],
    'Logging': ['LOG_LEVEL', 'LOG_FILE']
  };
  
  for (const [section, keys] of Object.entries(sections)) {
    envContent += `# ${section}\n`;
    for (const key of keys) {
      if (config[key] !== undefined) {
        envContent += `${key}=${config[key]}\n`;
      }
    }
    envContent += '\n';
  }
  
  fs.writeFileSync('.env', envContent);
  log.success('Environment file (.env) created successfully');
}

function installDependencies() {
  log.title('Installing Dependencies');
  
  try {
    log.info('Installing backend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    log.success('Backend dependencies installed');
    
    log.info('Installing frontend dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });
    log.success('Frontend dependencies installed');
  } catch (error) {
    log.error('Failed to install dependencies');
    throw error;
  }
}

function createDirectories() {
  log.title('Creating Required Directories');
  
  const directories = [
    'logs',
    'uploads/products',
    'uploads/categories',
    'uploads/users',
    'uploads/temp'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.success(`Created directory: ${dir}`);
    }
  });
}

function createStartupScripts() {
  log.title('Creating Startup Scripts');
  
  // Windows batch file
  const windowsScript = `@echo off
echo Starting KERVAN E-commerce Platform...
echo.
echo Backend: http://localhost:${defaultConfig.PORT}
echo Frontend: ${defaultConfig.FRONTEND_URL}
echo.
npm run dev
pause
`;
  
  fs.writeFileSync('start.bat', windowsScript);
  log.success('Created Windows startup script: start.bat');
  
  // Unix shell script
  const unixScript = `#!/bin/bash
echo "Starting KERVAN E-commerce Platform..."
echo ""
echo "Backend: http://localhost:${defaultConfig.PORT}"
echo "Frontend: ${defaultConfig.FRONTEND_URL}"
echo ""
npm run dev
`;
  
  fs.writeFileSync('start.sh', unixScript);
  try {
    fs.chmodSync('start.sh', '755');
  } catch (error) {
    // Ignore chmod errors on Windows
  }
  log.success('Created Unix startup script: start.sh');
}

function displayCompletionInfo(config) {
  log.title('Setup Complete!');
  
  console.log(`${colors.green}🎉 KERVAN E-commerce Platform is ready!${colors.reset}\n`);
  
  console.log(`${colors.bright}📊 Configuration Summary:${colors.reset}`);
  console.log(`   Backend URL: http://localhost:${config.PORT}`);
  console.log(`   Frontend URL: ${config.FRONTEND_URL}`);
  console.log(`   Database: ${config.MONGODB_URI}`);
  console.log(`   Environment: ${config.NODE_ENV}`);
  console.log(`   Admin Email: ${config.ADMIN_EMAIL}\n`);
  
  console.log(`${colors.bright}🚀 How to start:${colors.reset}`);
  console.log(`   ${colors.cyan}npm run dev${colors.reset}     - Start both backend and frontend`);
  console.log(`   ${colors.cyan}npm start${colors.reset}       - Start backend only`);
  console.log(`   ${colors.cyan}npm run client${colors.reset}  - Start frontend only\n`);
  
  console.log(`${colors.bright}📁 Quick start scripts:${colors.reset}`);
  console.log(`   ${colors.cyan}./start.sh${colors.reset}      - Unix/Linux/Mac`);
  console.log(`   ${colors.cyan}start.bat${colors.reset}       - Windows\n`);
  
  console.log(`${colors.bright}🔧 Important files:${colors.reset}`);
  console.log(`   ${colors.cyan}.env${colors.reset}            - Environment configuration`);
  console.log(`   ${colors.cyan}README.md${colors.reset}       - Documentation`);
  console.log(`   ${colors.cyan}DEPLOYMENT.md${colors.reset}   - Deployment guide\n`);
  
  console.log(`${colors.bright}🌐 API Endpoints:${colors.reset}`);
  console.log(`   ${colors.cyan}http://localhost:${config.PORT}${colors.reset}           - API Info`);
  console.log(`   ${colors.cyan}http://localhost:${config.PORT}/api/health${colors.reset} - Health Check`);
  console.log(`   ${colors.cyan}http://localhost:${config.PORT}/api/auth${colors.reset}   - Authentication`);
  console.log(`   ${colors.cyan}http://localhost:${config.PORT}/api/products${colors.reset} - Products\n`);
  
  if (!config.EMAIL_USER) {
    log.warning('Email not configured - some features may not work');
    console.log(`   Configure email in .env file for full functionality\n`);
  }
  
  console.log(`${colors.green}Happy coding! 🚀${colors.reset}\n`);
}

async function main() {
  try {
    console.log(`${colors.cyan}${colors.bright}`);
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    KERVAN E-COMMERCE                        ║');
    console.log('║                   Auto Setup Script                         ║');
    console.log('║                                                              ║');
    console.log('║  This script will automatically configure your project      ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`${colors.reset}\n`);
    
    await checkPrerequisites();
    const config = await collectConfiguration();
    
    createEnvFile(config);
    createDirectories();
    installDependencies();
    createStartupScripts();
    
    displayCompletionInfo(config);
    
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main, defaultConfig };
