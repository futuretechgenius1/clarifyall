# 🔴 URGENT: Fix Database Connection Error

## Current Problem

You're seeing this error:
```
code: 'ECONNREFUSED'
```

This means: **Your computer cannot connect to the Hostinger MySQL database.**

---

## ✅ SOLUTION: Whitelist Your IP Address

### Step 1: Get Your IP Address

**Windows:**
```cmd
curl ifconfig.me
```

**Or visit:** https://whatismyipaddress.com/

**Write down your IP address** (e.g., 123.456.789.012)

---

### Step 2: Whitelist IP in Hostinger

1. **Login to Hostinger:**
   - Go to: https://hpanel.hostinger.com
   - Enter your credentials

2. **Navigate to Remote MySQL:**
   - Click on your hosting plan
   - Go to: **Databases** section
   - Click: **Remote MySQL**

3. **Add Your IP:**
   - Click "**Add New IP**" or "**Add Access Host**"
   - Enter your IP address from Step 1
   - Click "**Add**" or "**Save**"

4. **Wait 1-2 minutes** for changes to take effect

---

### Step 3: Verify Your .env File

Make sure `backend/.env` exists with these exact values:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
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

**If this file doesn't exist, create it now!**

---

### Step 4: Test Connection

```bash
cd backend
npm run test-connection
```

**Expected Success Output:**
```
✅ Connection established successfully!
✅ Query executed successfully!
✅ Tables in database: ...
```

**If still failing, see "Alternative Solutions" below.**

---

### Step 5: Restart Backend Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

**Expected Success Output:**
```
🚀 Server running on port 8080
✅ Database connected successfully
```

---

## 🔄 Alternative Solutions

### Option 1: Use % Wildcard (Allow All IPs)

⚠️ **Less secure, but works for testing:**

In Hostinger Remote MySQL:
- Add IP: `%` (percent sign)
- This allows connections from any IP

---

### Option 2: Use Local MySQL (Recommended for Development)

**Install MySQL Locally:**

**Windows:**
1. Download: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Remember the root password you set

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

**Create Local Database:**
```bash
mysql -u root -p
# Enter your password

CREATE DATABASE clarifyall_db;
EXIT;
```

**Update backend/.env:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=clarifyall_db
```

**Initialize Database:**
```bash
npm run init-db
```

**Start Server:**
```bash
npm run dev
```

---

### Option 3: SSH Tunnel (Advanced)

If Hostinger doesn't allow Remote MySQL:

```bash
# Create SSH tunnel
ssh -L 3307:localhost:3306 u530425252@srv1148.hstgr.io

# Update .env
DB_HOST=localhost
DB_PORT=3307
```

---

## 🧪 Diagnostic Commands

### Test 1: Check if MySQL port is accessible
```bash
telnet srv1148.hstgr.io 3306
```

**Success:** You'll see a connection message  
**Failure:** "Connection refused" or timeout

### Test 2: Test with MySQL CLI
```bash
mysql -h srv1148.hstgr.io -u u530425252_kyc -p u530425252_kyc
# Password: &631^1HXVzqE
```

**Success:** MySQL prompt appears  
**Failure:** "Access denied" or "Connection refused"

### Test 3: Run Node.js test
```bash
cd backend
npm run test-connection
```

---

## 📋 Checklist

Before asking for help, verify:

- [ ] IP address is whitelisted in Hostinger Remote MySQL
- [ ] `backend/.env` file exists with correct credentials
- [ ] Database name is `u530425252_kyc` (not clarifyall)
- [ ] Username is `u530425252_kyc` (not clarifyall)
- [ ] Password is `&631^1HXVzqE`
- [ ] Waited 1-2 minutes after whitelisting IP
- [ ] Firewall is not blocking port 3306
- [ ] Internet connection is working

---

## 🎯 Quick Fix Summary

**Most Common Solution (90% of cases):**

1. Get your IP: `curl ifconfig.me`
2. Login to Hostinger → Remote MySQL
3. Add your IP address
4. Wait 2 minutes
5. Run: `npm run test-connection`
6. Run: `npm run dev`

**If that doesn't work:**

Use local MySQL for development (see Option 2 above)

---

## 🆘 Still Not Working?

### Check These:

1. **Is the database `u530425252_kyc` created in Hostinger?**
   - Login to cPanel → MySQL Databases
   - Verify database exists

2. **Is Remote MySQL enabled?**
   - Some Hostinger plans don't support Remote MySQL
   - Contact Hostinger support to enable it

3. **Is your IP dynamic?**
   - If your IP changes frequently, use local MySQL
   - Or add multiple IPs to whitelist

4. **Firewall blocking?**
   - Temporarily disable firewall to test
   - Add exception for port 3306

---

## 💡 Recommended Approach

**For Development:**
- Use **local MySQL** (Option 2)
- Faster, no connection issues
- No IP whitelisting needed

**For Production:**
- Deploy backend to Hostinger
- Use `localhost` for DB_HOST
- No remote connection needed

---

## 📞 Contact Support

If nothing works:

1. **Hostinger Support:**
   - Ask: "Can you enable Remote MySQL for my account?"
   - Ask: "Is my IP whitelisted for database access?"

2. **Provide This Info:**
   - Database: u530425252_kyc
   - Host: srv1148.hstgr.io
   - Your IP address
   - Error: ECONNREFUSED

---

**Bottom Line:** The #1 fix is whitelisting your IP in Hostinger Remote MySQL!
