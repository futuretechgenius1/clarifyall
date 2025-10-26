# Production Database Configuration

## Database Details

Your production database is hosted on Hostinger. Use these credentials:

```
Host: srv1148.hstgr.io
Port: 3306
Database Name: u530425252_clarifyall
Username: u530425252_clarifyall
Password: &631^1HXVzqE
```

## Setup Instructions

### 1. Create .env file

In the `backend/` directory, create a `.env` file with the following content:

```env
# Server Configuration
PORT=8080
NODE_ENV=production

# Production Database Configuration
DB_HOST=srv1148.hstgr.io
DB_PORT=3306
DB_USER=u530425252_clarifyall
DB_PASSWORD=&631^1HXVzqE
DB_NAME=u530425252_clarifyall

# File Upload Configuration
UPLOAD_DIR=uploads/logos
MAX_FILE_SIZE=5242880

# CORS Configuration (Update with your frontend URL)
CORS_ORIGIN=http://localhost:3000
```

### 2. Initialize Database

Run the initialization script to create tables and seed categories:

```bash
cd backend
npm run init-db
```

This will:
- Create the `categories` table
- Create the `tools` table
- Create the `tool_categories` junction table
- Insert 25 pre-configured AI tool categories

### 3. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Important Notes

### Security
⚠️ **NEVER commit the `.env` file to version control!**

The `.env` file is already in `.gitignore` to prevent accidental commits.

### CORS Configuration

Update `CORS_ORIGIN` in `.env` with your actual frontend URL:

**For local development:**
```env
CORS_ORIGIN=http://localhost:3000
```

**For production:**
```env
CORS_ORIGIN=https://your-domain.com
```

### Database Connection

The application will automatically:
- Create a connection pool to your MySQL database
- Initialize tables if they don't exist
- Handle connection errors gracefully

### File Uploads

Uploaded logos will be stored in `backend/uploads/logos/`

Make sure this directory has proper write permissions:
```bash
mkdir -p uploads/logos
chmod 755 uploads/logos
```

## Testing the Connection

Test your database connection:

```bash
node -e "require('./config/database').testConnection()"
```

Expected output:
```
✅ Database connection successful!
Database: u530425252_clarifyall
```

## Troubleshooting

### Connection Timeout

If you get a connection timeout error, check:
1. Your server's IP is whitelisted in Hostinger's Remote MySQL settings
2. Port 3306 is not blocked by firewall
3. Database credentials are correct

### Access Denied

If you get "Access denied" error:
1. Verify username and password are correct
2. Check if the user has proper permissions
3. Ensure you're connecting to the correct host

### Tables Not Created

If tables are not created automatically:
1. Run the init script manually: `npm run init-db`
2. Check database user has CREATE TABLE permissions
3. Review error logs for specific issues

## Manual Database Setup (Alternative)

If automatic initialization fails, you can create tables manually:

```sql
-- Connect to your database
mysql -h srv1148.hstgr.io -u u530425252_clarifyall -p u530425252_clarifyall

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tools table
CREATE TABLE IF NOT EXISTS tools (
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

-- Create junction table
CREATE TABLE IF NOT EXISTS tool_categories (
  tool_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (tool_id, category_id),
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

## Deployment Checklist

- [ ] Create `.env` file with production credentials
- [ ] Update `CORS_ORIGIN` with your frontend URL
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run init-db` to initialize database
- [ ] Test database connection
- [ ] Start server with `npm start`
- [ ] Verify API endpoints are accessible
- [ ] Test file upload functionality

## Support

If you encounter any issues:
1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Ensure database is accessible from your server
4. Contact Hostinger support if database connection issues persist

---

**Database Provider:** Hostinger
**Connection Type:** Remote MySQL
**SSL:** Not required (check with Hostinger if SSL is available)
