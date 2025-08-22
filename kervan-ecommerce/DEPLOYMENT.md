# 🚀 Deployment Guide for KERVAN E-commerce Platform

This guide will help you deploy your KERVAN e-commerce platform to various environments.

## 📋 Pre-deployment Checklist

- [ ] All environment variables are configured
- [ ] Database is set up and accessible
- [ ] Email service is configured
- [ ] SSL certificates are ready (for production)
- [ ] Domain name is configured (for production)

## 🌐 GitHub Repository Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click "New repository" or go to https://github.com/new
3. Repository name: `kervan-ecommerce`
4. Description: `Complete wholesale e-commerce platform built with Node.js, Express, React, and MongoDB`
5. Choose Public or Private
6. **DO NOT** initialize with README (we already have one)
7. Click "Create repository"

### 2. Push to GitHub

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/kervan-ecommerce.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Configure Repository Settings

After pushing, configure these settings on GitHub:

#### Branch Protection Rules
- Go to Settings → Branches
- Add rule for `main` branch:
  - [x] Require pull request reviews before merging
  - [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging

#### Secrets for GitHub Actions
Go to Settings → Secrets and variables → Actions and add:

- `MONGODB_URI`: Your production MongoDB connection string
- `JWT_SECRET`: Strong JWT secret key
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password
- `SNYK_TOKEN`: Snyk security token (optional)

## 🐳 Docker Deployment

### Local Development with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Deployment

```bash
# Build production image
docker build -t kervan-ecommerce:latest .

# Run with environment variables
docker run -d \
  --name kervan-app \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  kervan-ecommerce:latest
```

## ☁️ Cloud Deployment Options

### 1. Heroku Deployment

```bash
# Install Heroku CLI
# Create Heroku app
heroku create kervan-ecommerce

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set EMAIL_USER=your-email
heroku config:set EMAIL_PASS=your-email-password

# Deploy
git push heroku main
```

### 2. AWS Deployment

#### Using AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI
2. Initialize Elastic Beanstalk:
   ```bash
   eb init kervan-ecommerce
   eb create production
   eb deploy
   ```

#### Using AWS ECS with Docker

1. Push Docker image to ECR
2. Create ECS cluster
3. Define task definition
4. Create service

### 3. DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
3. Set environment variables
4. Deploy

### 4. Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update `MONGODB_URI` environment variable

### Self-hosted MongoDB

```bash
# Using Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:5.0
```

## 📧 Email Service Setup

### Gmail Setup

1. Enable 2-factor authentication
2. Generate app-specific password
3. Use in `EMAIL_PASS` environment variable

### SendGrid Setup

1. Create SendGrid account
2. Get API key
3. Update email service configuration

### AWS SES Setup

1. Set up AWS SES
2. Verify domain/email
3. Update email service configuration

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Using Cloudflare

1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption

## 📊 Monitoring and Logging

### Application Monitoring

- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure and application monitoring
- **Sentry**: Error tracking and performance monitoring

### Log Management

- **LogRocket**: Frontend logging
- **Winston**: Backend logging (already configured)
- **ELK Stack**: Elasticsearch, Logstash, Kibana

## 🔧 Environment Variables Reference

### Required Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your-super-secret-key
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password
FRONTEND_URL=https://yourdomain.com
```

### Optional Variables

```env
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-s3-bucket
STRIPE_SECRET_KEY=sk_live_...
SENTRY_DSN=https://...
```

## 🚨 Security Checklist

- [ ] Environment variables are secure
- [ ] Database has authentication enabled
- [ ] SSL/HTTPS is configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] Security headers are set
- [ ] Dependencies are up to date
- [ ] Secrets are not in code
- [ ] CORS is properly configured
- [ ] File upload restrictions are in place

## 📈 Performance Optimization

### Backend Optimization

- Enable gzip compression
- Use Redis for caching
- Optimize database queries
- Use CDN for static assets
- Enable HTTP/2

### Frontend Optimization

- Code splitting
- Lazy loading
- Image optimization
- Bundle optimization
- Service workers

## 🔄 CI/CD Pipeline

The GitHub Actions workflow will:

1. **Test**: Run unit and integration tests
2. **Security**: Check for vulnerabilities
3. **Build**: Create production build
4. **Deploy**: Deploy to production (configure as needed)

## 📞 Support and Maintenance

### Regular Maintenance Tasks

- Update dependencies monthly
- Monitor security vulnerabilities
- Review and rotate secrets quarterly
- Monitor application performance
- Backup database regularly

### Getting Help

- Check documentation first
- Search existing GitHub issues
- Create new issue with detailed information
- Contact support: support@kervan.com

---

**Happy Deploying! 🚀**

For more detailed deployment instructions for specific platforms, check the official documentation of your chosen deployment platform.
