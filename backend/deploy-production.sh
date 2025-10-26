#!/bin/bash

# Clarifyall Production Deployment Script
# This script sets up the production environment with Hostinger database

echo "🚀 Clarifyall Production Deployment"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env file from production template
if [ ! -f .env ]; then
    echo "📝 Creating .env file from production template..."
    cp .env.production .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Review and update the following in .env:"
    echo "   - CORS_ORIGIN: Set to your frontend URL"
    echo "   - PORT: Change if needed (default: 8080)"
    echo ""
else
    echo "⚠️  .env file already exists. Skipping creation."
    echo ""
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads/logos
chmod 755 uploads/logos
echo "✅ Uploads directory created"
echo ""

# Test database connection
echo "🔌 Testing database connection..."
node -e "
const mysql = require('mysql2/promise');
(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'srv1148.hstgr.io',
      port: 3306,
      user: 'u530425252_clarifyall',
      password: '&631^1HXVzqE',
      database: 'u530425252_clarifyall'
    });
    console.log('✅ Database connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
})();
"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Database connection test failed"
    echo "Please check:"
    echo "  1. Your server IP is whitelisted in Hostinger"
    echo "  2. Database credentials are correct"
    echo "  3. Port 3306 is not blocked"
    exit 1
fi

echo ""

# Initialize database
echo "🗄️  Initializing database..."
npm run init-db

if [ $? -ne 0 ]; then
    echo "❌ Database initialization failed"
    echo "You may need to initialize manually. See PRODUCTION_CONFIG.md"
    exit 1
fi

echo ""
echo "✅ Database initialized successfully"
echo ""

# Summary
echo "🎉 Production deployment complete!"
echo ""
echo "Next steps:"
echo "1. Review .env file and update CORS_ORIGIN with your frontend URL"
echo "2. Start the server:"
echo "   - Development: npm run dev"
echo "   - Production: npm start"
echo "   - With PM2: pm2 start server.js --name clarifyall-api"
echo ""
echo "3. Test the API:"
echo "   curl http://localhost:8080/api/v1/health"
echo ""
echo "📚 For more information, see:"
echo "   - backend/PRODUCTION_CONFIG.md"
echo "   - backend/README.md"
echo ""
