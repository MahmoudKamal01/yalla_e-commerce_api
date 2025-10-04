# Yalla E-commerce API - Docker Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Yalla E-commerce API - Docker Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Docker is not installed or not running!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Compose is available
try {
    $composeVersion = docker-compose --version
    Write-Host "✓ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Docker Compose is not available!" -ForegroundColor Red
    Write-Host "Please make sure Docker Desktop is properly installed." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Checking for config.env file..." -ForegroundColor Yellow

if (-not (Test-Path "config.env")) {
    Write-Host "⚠ WARNING: config.env file not found!" -ForegroundColor Yellow
    Write-Host "Creating config.env file from template..." -ForegroundColor Yellow
    
    if (Test-Path "env.example") {
        Copy-Item "env.example" "config.env"
        Write-Host "✓ config.env file created from template" -ForegroundColor Green
    } else {
        Write-Host "✗ ERROR: env.example file not found!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host ""
    Write-Host "IMPORTANT: Please edit the config.env file with your actual configuration values!" -ForegroundColor Red
    Write-Host "Then run this script again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ config.env file found" -ForegroundColor Green

Write-Host ""
Write-Host "Pulling latest images..." -ForegroundColor Yellow
docker-compose pull

Write-Host ""
Write-Host "Building application image..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Service Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Application URLs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Server: http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Container is running!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs, run: docker-compose logs -f app" -ForegroundColor Yellow
Write-Host "To stop the container, run: docker-compose down" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to view logs now (or Ctrl+C to exit)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Live Logs (Press Ctrl+C to stop)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker-compose logs -f app
