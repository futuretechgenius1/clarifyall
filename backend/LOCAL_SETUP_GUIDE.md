# Local Development Setup with Hostinger Database

This guide will help you set up the Clarifyall backend locally using your Hostinger production database.

## 📋 Database Credentials

Your Hostinger database details:
```
Host: srv1148.hstgr.io
Port: 3306
Database: u530425252_clarifyall
Username: u530425252_clarifyall
Password: &631^1HXVzqE
```

## 🚀 Quick Setup (5 Steps)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File

Create a new file named `.env` in the `backend/` directory with this content:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Hostinger Database Configuration
DB_HOST=srv1148.hstgr.io
DB_PORT=3306
DB_USER=u530425252_clarifyall
DB_PASSWORD=&631^1HXVzqE
DB_NAME=u530425252_clarifyall

# File Upload Configuration
UPLOAD_DIR=uploads/logos
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**💡 Tip:** You can copy from `.env.production` file:
```bash
# On Windows
copy .env.production .env

# On Mac/Linux
cp .env.production .env
```

### Step 4: Initialize Database

This will create tables and seed 25 categories:
```bash
npm run init-db
```

Expected output:
```
🔄 Initializing database...

Creating tables...
✅ Database tables created successfully

Inserting categories...
  ✓ Chatbots & Virtual Companions
  ✓ Image Generation & Editing
  ✓ Writing & Editing
  ... (22 more categories)

✅ Database initialized successfully with 25 categories!
```

### Step 5: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at: `http://localhost:8080`

## ✅ Verify Setup

### Test 1: Health Check
```bash
curl http://localhost:8080/api/v1/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Clarifyall API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Get Categories
```bash
curl http://localhost:8080/api/v1/categories
```

Expected: Array of 25 categories

### Test 3: Get Tools
```bash
curl http://localhost:8080/api/v1/tools
```

Expected: Paginated response (empty initially)

## 🔧 Configuration Details

### Environment Variables Explained

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | 8080 | Server port (change if 8080 is in use) |
| `NODE_ENV` | development | Environment mode |
| `DB_HOST` | srv1148.hstgr.io | Hostinger MySQL server |
| `DB_PORT` | 3306 | MySQL port |
| `DB_USER` | u530425252_clarifyall | Database username |
| `DB_PASSWORD` | &631^1HXVzqE | Database password |
| `DB_NAME` | u530425252_clarifyall | Database name |
| `UPLOAD_DIR` | uploads/logos | Logo storage directory |
| `MAX_FILE_SIZE` | 5242880 | Max upload size (5MB) |
| `CORS_ORIGIN` | http://localhost:3000 | Frontend URL |

### Important Notes

1. **Remote Database:** You're connecting to a remote Hostinger database, not localhost
2. **IP Whitelisting:** Ensure your local IP is whitelisted in Hostinger's Remote MySQL settings
3. **Firewall:** Port 3306 must not be blocked by your firewall
4. **Shared Database:** This is the same database used in production

## 🐛 Troubleshooting

### Error: "ECONNREFUSED" or "Connection timeout"

**Cause:** Cannot connect to Hostinger database

**Solutions:**
1. Check if your IP is whitelisted in Hostinger cPanel:
   - Login to Hostinger cPanel
   - Go to "Remote MySQL"
   - Add your current IP address

2. Verify credentials in `.env` file
3. Test connection manually:
```bash
mysql -h srv1148.hstgr.io -u u530425252_clarifyall -p u530425252_clarifyall
# Enter password: &631^1HXVzqE
```

### Error: "Access denied for user"

**Cause:** Incorrect credentials

**Solution:** Double-check username and password in `.env` file

### Error: "Port 8080 already in use"

**Cause:** Another application is using port 8080

**Solution:** Change PORT in `.env`:
```env
PORT=8081
```

### Error: "Cannot find module 'express'"

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database initialization fails

**Solution:** Initialize manually using SQL:
```bash
mysql -h srv1148.hstgr.io -u u530425252_clarifyall -p u530425252_clarifyall < backend/scripts/schema.sql
```

## 📊 Database Schema

The initialization creates these tables:

### categories
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### tools
```sql
CREATE TABLE tools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500) NOT NULL,
  short_description VARCHAR(150) NOT NULL,
  full_description TEXT,
  logo_url VARCHAR(500),
  pricing_model ENUM('FREE', 'FREEMIUM', 'FREE_TRIAL', 'PAID') NOT NULL,
  status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_APPROVAL',
  submitter_email VARCHAR(255) NOT NULL,
  view_count INT DEFAULT 0,
  save_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### tool_categories
```sql
CREATE TABLE tool_categories (
  tool_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (tool_id, category_id),
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

## 🧪 Testing API Endpoints

### Using curl

**Get all categories:**
```bash
curl http://localhost:8080/api/v1/categories
```

**Get tools with filters:**
```bash
curl "http://localhost:8080/api/v1/tools?page=0&size=12&pricingModel=FREE"
```

**Submit a tool (with file upload):**
```bash
curl -X POST http://localhost:8080/api/v1/tools/submit \
  -F 'toolData={"name":"ChatGPT","websiteUrl":"https://chat.openai.com","categoryIds":[1,3],"pricingModel":"FREEMIUM","shortDescription":"AI conversational assistant","submitterEmail":"test@example.com"}' \
  -F 'logo=@/path/to/logo.png'
```

### Using Postman

1. Import collection from API_DOCUMENTATION.md
2. Set base URL: `http://localhost:8080/api/v1`
3. Test each endpoint

## 📝 Development Workflow

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend (in new terminal):**
   ```bash
   cd frontend
   npm start
   ```

3. **Access application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api/v1

4. **Make changes:**
   - Backend changes auto-reload with nodemon
   - Frontend changes auto-reload with React

## 🔐 Security Notes

1. **Never commit .env file** - It's in .gitignore
2. **Use environment-specific configs** - Different .env for dev/prod
3. **Rotate passwords regularly** - Update in Hostinger and .env
4. **Limit database access** - Only whitelist necessary IPs

## 📚 Next Steps

1. ✅ Complete this setup
2. ✅ Test all API endpoints
3. ✅ Start frontend development
4. ✅ Test full application flow
5. ✅ Deploy to production

## 🆘 Need Help?

- Check `backend/README.md` for detailed documentation
- Review `PRODUCTION_CONFIG.md` for production setup
- See `NODEJS_BACKEND_SETUP.md` for comprehensive guide

---

**Database Provider:** Hostinger  
**Connection Type:** Remote MySQL  
**Environment:** Development (using production database)
