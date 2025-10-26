# ⚠️ UPDATED DATABASE CONFIGURATION

## New Database Credentials

Your database has been changed to:

```
Host:     srv1148.hstgr.io
Port:     3306
Database: u530425252_kyc
Username: u530425252_kyc
Password: &631^1HXVzqE
```

---

## 🔧 Required Updates

### 1. Update `.env` File (REQUIRED)

Create or update `backend/.env` with these values:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# NEW Database Configuration
DB_HOST=srv1148.hstgr.io
DB_PORT=3306
DB_USER=u530425252_kyc
DB_PASSWORD=&631^1HXVzqE
DB_NAME=u530425252_kyc

# File Upload Configuration
UPLOAD_DIR=uploads/logos
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 2. Update `test-connection.js`

Replace the config object in `backend/test-connection.js`:

```javascript
const config = {
  host: 'srv1148.hstgr.io',
  port: 3306,
  user: 'u530425252_kyc',          // CHANGED
  password: '&631^1HXVzqE',
  database: 'u530425252_kyc',       // CHANGED
  connectTimeout: 10000
};
```

### 3. Update `database-setup.sql`

Replace the first line in `backend/database-setup.sql`:

```sql
-- Use the database
USE u530425252_kyc;  -- CHANGED from u530425252_clarifyall
```

### 4. Update `initDatabase.js`

The script reads from `.env`, so just update your `.env` file.

---

## 🚀 Quick Setup Steps

### Step 1: Create `.env` File

```bash
cd backend

# Windows
copy .env.production .env

# Mac/Linux
cp .env.production .env
```

Then edit `backend/.env` and change these lines:
```env
DB_USER=u530425252_kyc
DB_NAME=u530425252_kyc
```

### Step 2: Test Connection

```bash
npm run test-connection
```

If you see errors, update `test-connection.js` manually with the new credentials.

### Step 3: Setup Database

**Option A: Using phpMyAdmin (Easiest)**

1. Login to Hostinger cPanel → phpMyAdmin
2. Select database: `u530425252_kyc`
3. Click "SQL" tab
4. Copy content from `backend/database-setup.sql`
5. **IMPORTANT:** Change the first line to:
   ```sql
   USE u530425252_kyc;
   ```
6. Paste and click "Go"

**Option B: Using Node.js Script**

```bash
npm run init-db
```

### Step 4: Start Server

```bash
npm run dev
```

### Step 5: Start Frontend

```bash
cd frontend
npm start
```

---

## 📝 Files That Need Manual Updates

Since I cannot edit .env files directly, you need to manually update:

### 1. `backend/.env` (Create this file)
```env
DB_HOST=srv1148.hstgr.io
DB_PORT=3306
DB_USER=u530425252_kyc
DB_PASSWORD=&631^1HXVzqE
DB_NAME=u530425252_kyc
```

### 2. `backend/test-connection.js` (Lines 11-16)
```javascript
const config = {
  host: 'srv1148.hstgr.io',
  port: 3306,
  user: 'u530425252_kyc',
  password: '&631^1HXVzqE',
  database: 'u530425252_kyc',
  connectTimeout: 10000
};
```

### 3. `backend/database-setup.sql` (Line 11)
```sql
USE u530425252_kyc;
```

### 4. `backend/.env.production` (Optional - for production)
```env
DB_USER=u530425252_kyc
DB_NAME=u530425252_kyc
```

---

## ✅ Verification

After making the changes, verify:

```bash
# Test connection
cd backend
npm run test-connection

# Should output:
# ✅ Connection established successfully!
# ✅ Query executed successfully!
```

---

## 🔍 Troubleshooting

### Still getting ECONNREFUSED?

1. **Whitelist your IP in Hostinger:**
   - Login to Hostinger cPanel
   - Go to: Databases → Remote MySQL
   - Add your IP address
   - Get your IP: `curl ifconfig.me`

2. **Verify database exists:**
   - Login to phpMyAdmin
   - Check if `u530425252_kyc` database exists
   - If not, create it in cPanel → MySQL Databases

3. **Check credentials:**
   - Verify username: `u530425252_kyc`
   - Verify password: `&631^1HXVzqE`
   - Verify database name: `u530425252_kyc`

---

## 📋 Summary of Changes

| Item | Old Value | New Value |
|------|-----------|-----------|
| Database Name | u530425252_clarifyall | u530425252_kyc |
| Username | u530425252_clarifyall | u530425252_kyc |
| Password | &631^1HXVzqE | &631^1HXVzqE (same) |
| Host | srv1148.hstgr.io | srv1148.hstgr.io (same) |

---

## 🎯 Next Steps

1. ✅ Update `.env` file with new credentials
2. ✅ Update `test-connection.js` (optional, for testing)
3. ✅ Update `database-setup.sql` first line
4. ✅ Test connection: `npm run test-connection`
5. ✅ Initialize database: `npm run init-db` OR use phpMyAdmin
6. ✅ Start server: `npm run dev`
7. ✅ Start frontend: `cd frontend && npm start`
8. ✅ Test application: http://localhost:3000

---

**Important:** The main file you MUST update is `backend/.env` with the new database credentials!
