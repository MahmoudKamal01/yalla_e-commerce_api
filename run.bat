@echo off
echo ========================================
echo    Yalla E-commerce API - Docker Setup
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

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not available!
    echo Please make sure Docker Desktop is properly installed.
    pause
    exit /b 1
)

echo Checking for config.env file...
if not exist config.env (
    echo WARNING: config.env file not found!
    echo Creating config.env file from template...
    copy env.example config.env
    echo.
    echo IMPORTANT: Please edit the config.env file with your actual configuration values!
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo Pulling latest images...
docker-compose pull

echo.
echo Building application image...
docker-compose build --no-cache

echo.
echo Starting services...
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    Service Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo    Application URLs
echo ========================================
echo API Server: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

echo ========================================
echo    Container is running!
echo ========================================
echo.
echo To view logs, run: docker-compose logs -f app
echo To stop the container, run: docker-compose down
echo.
echo Press any key to view logs now (or Ctrl+C to exit)...
pause >nul

echo.
echo ========================================
echo    Live Logs (Press Ctrl+C to stop)
echo ========================================
docker-compose logs -f app
