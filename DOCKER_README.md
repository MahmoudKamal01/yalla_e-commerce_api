# 🐳 Docker Setup for Yalla E-commerce API

This guide will help you run the Yalla E-commerce API using Docker with a one-click setup.

## 🚀 Quick Start (Windows)

### Option 1: One-Click Run (Recommended)

1. **Double-click `run.bat`** - This will automatically:
   - Check for Docker installation
   - Create `.env` file from template if needed
   - Pull latest images
   - Build and start all services
   - Show service status and logs

### Option 2: PowerShell Script

1. **Right-click `run.ps1`** → **"Run with PowerShell"**
2. Follow the on-screen instructions

### Option 3: Manual Commands

```bash
# 1. Create .env file from template
copy env.example .env

# 2. Edit .env file with your configuration
notepad .env

# 3. Start services
docker-compose up -d

# 4. View logs
docker-compose logs -f app
```

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **Windows 10/11** with PowerShell support
- **Git** (for cloning the repository)

## 🔧 Configuration

### Environment Variables

Edit the `config.env` file with your actual values:

```env
# Server Configuration
PORT=8000
NODE_ENV=production
BASE_URL=http://localhost:8000

# Database Configuration
DB_USER=db_admin
DB_PASSWORD=your_secure_password
DB_NAME=yalla-ecommerce-db
DB_URI=mongodb://mongodb:27017/yalla-ecommerce-db

# MongoDB Root Credentials
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_mongo_root_password

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_EXPIRE_TIME=90d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## 🏗️ Architecture

The Docker setup includes:

- **API Server** (Node.js) - Port 8000
- **MongoDB** - Port 27017
- **Redis** (Optional) - Port 6379
- **Persistent Volumes** for data storage

## 📊 Service URLs

Once running, access:

- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 🛠️ Available Commands

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild services
docker-compose build --no-cache

# Pull latest images
docker-compose pull
```

### NPM Scripts

```bash
# Development mode
npm run dev

# Production mode
npm start

# Docker commands
npm run docker:compose:up
npm run docker:compose:down
npm run docker:compose:logs
```

## 🔍 Troubleshooting

### Common Issues

1. **Docker not running**

   - Start Docker Desktop
   - Wait for it to fully load

2. **Port already in use**

   - Stop other services using ports 8000, 27017, 6379
   - Or change ports in docker-compose.yml

3. **Permission denied**

   - Run PowerShell as Administrator
   - Or use Command Prompt

4. **Environment variables not loading**
   - Check `.env` file exists in root directory
   - Verify file format (no spaces around =)

### Useful Commands

```bash
# Check service status
docker-compose ps

# View all logs
docker-compose logs

# Restart specific service
docker-compose restart app

# Remove all containers and volumes
docker-compose down -v

# Clean up unused images
docker system prune -f
```

## 🚀 Production Deployment

### Building and Pushing to Docker Hub

```bash
# Build the image
docker build -t mahmoudkamalaldeen/yalla_ecommerce_api .

# Tag for version
docker tag mahmoudkamalaldeen/yalla_ecommerce_api:latest mahmoudkamalaldeen/yalla_ecommerce_api:v1.0.0

# Push to Docker Hub
docker push mahmoudkamalaldeen/yalla_ecommerce_api:latest
docker push mahmoudkamalaldeen/yalla_ecommerce_api:v1.0.0
```

### Pulling and Running from Docker Hub

```bash
# Pull latest image
docker pull mahmoudkamalaldeen/yalla_ecommerce_api:latest

# Run with environment file
docker run -p 8000:8000 --env-file .env mahmoudkamalaldeen/yalla_ecommerce_api:latest
```

## 📁 File Structure

```
yalla_e-commerce_api/
├── Dockerfile              # Docker image configuration
├── docker-compose.yml      # Multi-container setup
├── .dockerignore           # Files to exclude from Docker build
├── env.example            # Environment variables template
├── mongo-init.js          # MongoDB initialization script
├── run.bat               # Windows batch script
├── run.ps1               # PowerShell script
├── stop.bat              # Stop services script
└── DOCKER_README.md       # This file
```

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use strong passwords for database credentials
- Generate secure JWT secret keys
- Use environment-specific configurations
- Regularly update Docker images for security patches

## 📞 Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f app`
2. Verify Docker is running: `docker --version`
3. Check service status: `docker-compose ps`
4. Review the troubleshooting section above

---

**Happy coding! 🚀**
