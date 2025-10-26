@echo off
REM Clarifyall Production Deployment Script for Windows
REM This script sets up the production environment with Hostinger database

echo.
echo ========================================
echo Clarifyall Production Deployment
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

echo [OK] npm version:
npm --version
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed successfully
echo.

REM Create .env file from production template
if not exist .env (
    echo [INFO] Creating .env file from production template...
    copy .env.production .env
    echo [OK] .env file created
    echo.
    echo [WARNING] IMPORTANT: Review and update the following in .env:
    echo    - CORS_ORIGIN: Set to your frontend URL
    echo    - PORT: Change if needed (default: 8080)
    echo.
) else (
    echo [WARNING] .env file already exists. Skipping creation.
    echo.
)

REM Create uploads directory
echo [INFO] Creating uploads directory...
if not exist uploads\logos mkdir uploads\logos
echo [OK] Uploads directory created
echo.

REM Test database connection
echo [INFO] Testing database connection...
node -e "const mysql = require('mysql2/promise'); (async () => { try { const connection = await mysql.createConnection({ host: 'srv1148.hstgr.io', port: 3306, user: 'u530425252_clarifyall', password: '&631^1HXVzqE', database: 'u530425252_clarifyall' }); console.log('[OK] Database connection successful!'); await connection.end(); } catch (error) { console.error('[ERROR] Database connection failed:', error.message); process.exit(1); } })();"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Database connection test failed
    echo Please check:
    echo   1. Your server IP is whitelisted in Hostinger
    echo   2. Database credentials are correct
    echo   3. Port 3306 is not blocked
    exit /b 1
)
echo.

REM Initialize database
echo [INFO] Initializing database...
call npm run init-db
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database initialization failed
    echo You may need to initialize manually. See PRODUCTION_CONFIG.md
    exit /b 1
)

echo.
echo [OK] Database initialized successfully
echo.

REM Summary
echo ========================================
echo Production deployment complete!
echo ========================================
echo.
echo Next steps:
echo 1. Review .env file and update CORS_ORIGIN with your frontend URL
echo 2. Start the server:
echo    - Development: npm run dev
echo    - Production: npm start
echo    - With PM2: pm2 start server.js --name clarifyall-api
echo.
echo 3. Test the API:
echo    curl http://localhost:8080/api/v1/health
echo.
echo For more information, see:
echo    - backend/PRODUCTION_CONFIG.md
echo    - backend/README.md
echo.
pause
