@echo off
echo ========================================
echo    Stopping Yalla E-commerce API
echo ========================================
echo.

echo Stopping all services...
docker-compose down

echo.
echo Cleaning up unused images and containers...
docker system prune -f

echo.
echo ========================================
echo    Services stopped successfully!
echo ========================================
pause
