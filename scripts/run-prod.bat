@echo off
echo ========================================
echo    Yalla E-commerce API - Production
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Checking for config.env file...
if not exist config.env (
    echo WARNING: config.env file not found!
    echo Creating config.env file from template...
    copy env.example config.env
    echo.
    echo IMPORTANT: Please edit the config.env file with your production configuration!
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo Pulling latest production image...
docker pull mahmoudkamalaldeen/yalla_ecommerce_api:latest

echo.
echo Starting production services...
docker-compose -f docker-compose.prod.yml up -d

echo.
echo Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo    Production Service Status
echo ========================================
docker-compose -f docker-compose.prod.yml ps

echo.
echo ========================================
echo    Production URLs
echo ========================================
echo API Server: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

echo ========================================
echo    Production Container is running!
echo ========================================
echo.
echo To view logs, run: docker-compose -f docker-compose.prod.yml logs -f app
echo To stop the container, run: docker-compose -f docker-compose.prod.yml down
echo.
echo Press any key to view logs now (or Ctrl+C to exit)...
pause >nul

echo.
echo ========================================
echo    Production Live Logs (Press Ctrl+C to stop)
echo ========================================
docker-compose -f docker-compose.prod.yml logs -f app
