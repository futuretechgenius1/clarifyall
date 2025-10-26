# Database Connection Troubleshooting Guide

## Error: ECONNREFUSED

You're seeing this error because the Node.js backend cannot connect to your Hostinger MySQL database.

```
code: 'ECONNREFUSED',
errno: undefined,
sql: undefined,
sqlState: undefined,
sqlMessage: undefined
```

## Root Causes & Solutions

### 1. IP Not Whitelisted in Hostinger (Most Common)

**Problem:** Hostinger blocks remote MySQL connections by default for security.

**Solution:**

1. **Login to Hostinger cPanel**
   - Go to https://hpanel.hostinger.com
   - Login with your credentials

2. **Navigate to Remote MySQL**
   - Find "Databases" section
   - Click "Remote MySQL"

3. **Add Your IP Address**
   - Click "Add New IP"
   - Enter your current IP address
   - Or use `%` to allow all IPs (not recommended for production)
   - Click "Add"

4. **Get Your Current IP:**
   ```bash
   # Windows
   curl ifconfig.me
   
   # Or visit
   https://whatismyipaddress.com/
   ```

5. **Restart your backend server**
   ```bash
   npm run dev
   ```

---

### 2. Incorrect Database Credentials

**Problem:** Wrong host, username, password, or database name in `.env` file.

**Solution:** Verify your `.env` file has the correct credentials:

```env
DB_HOST=srv1148.hstgr.io
DB_PORT=3306
DB_USER=u530425252_clarifyall
DB_PASSWORD=&631^1HXVzqE
DB_NAME=u530425252_clarifyall
```

**Test connection manually:**
```bash
mysql -h srv1148.hstgr.io -u u530425252_clarifyall -p u530425252_clarifyall
# Enter password when prompted: &631^1HXVzqE
```

---

### 3. Firewall Blocking Port 3306

**Problem:** Your local firewall or network is blocking MySQL port 3306.

**Solution:**

**Windows:**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Outbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port "3306" → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name it "MySQL Outbound" → Finish

**Mac/Linux:**
```bash
# Check if port is blocked
telnet srv1148.hstgr.io 3306

# If connection fails, check firewall settings
```

---

### 4. Hostinger MySQL Service Down

**Problem:** Hostinger's MySQL service might be temporarily down.

**Solution:**
1. Check Hostinger status page
2. Contact Hostinger support
3. Wait and retry

---

### 5. Wrong MySQL Host/Port

**Problem:** Hostinger might use a different host or port for remote connections.

**Solution:**

Check your Hostinger cPanel for the correct MySQL hostname:
1. Login to cPanel
2. Go to "Databases" → "MySQL Databases"
3. Look for "Remote MySQL" section
4. Verify the hostname (should be `srv1148.hstgr.io`)

---

## Quick Fix: Test Connection Script

Create a test file to verify connection:

**File:** `backend/test-connection.js`

```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing MySQL connection...\n');
  
  const config = {
    host: 'srv1148.hstgr.io',
    port: 3306,
    user: 'u530425252_clarifyall',
    password: '&631^1HXVzqE',
    database: 'u530425252_clarifyall',
    connectTimeout: 10000
  };
  
  console.log('Connection config:');
  console.log(`Host: ${config.host}`);
  console.log(`Port: ${config.port}`);
  console.log(`User: ${config.user}`);
  console.log(`Database: ${config.database}\n`);
  
  try {
    console.log('Attempting connection...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query successful:', rows);
    
    await connection.end();
    console.log('✅ Connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\nPossible causes:');
    console.error('1. IP not whitelisted in Hostinger Remote MySQL');
    console.error('2. Incorrect credentials');
    console.error('3. Firewall blocking port 3306');
    console.error('4. MySQL service down');
    
    process.exit(1);
  }
}

testConnection();
```

**Run the test:**
```bash
node backend/test-connection.js
```

---

## Alternative: Use SSH Tunnel (If Remote MySQL Doesn't Work)

If Hostinger doesn't allow direct remote MySQL connections, use SSH tunneling:

### Step 1: Enable SSH in Hostinger
1. Login to Hostinger cPanel
2. Go to "Advanced" → "SSH Access"
3. Enable SSH access

### Step 2: Create SSH Tunnel
```bash
# Windows (use PuTTY or Git Bash)
ssh -L 3307:localhost:3306 u530425252@srv1148.hstgr.io

# Mac/Linux
ssh -L 3307:localhost:3306 u530425252@srv1148.hstgr.io
```

### Step 3: Update .env
```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=u530425252_clarifyall
DB_PASSWORD=&631^1HXVzqE
DB_NAME=u530425252_clarifyall
```

---

## Recommended Solution for Development

### Option 1: Use Local MySQL (Easiest)

Install MySQL locally and use it for development:

1. **Install MySQL:**
   - Windows: https://dev.mysql.com/downloads/installer/
   - Mac: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Create local database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE clarifyall_db;
   EXIT;
   ```

3. **Update .env for local development:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_local_password
   DB_NAME=clarifyall_db
   ```

4. **Run database setup:**
   ```bash
   npm run init-db
   ```

### Option 2: Use Docker MySQL

```bash
# Start MySQL container
docker run --name clarifyall-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=clarifyall_db \
  -p 3306:3306 \
  -d mysql:8

# Update .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=clarifyall_db
```

---

## Production Deployment

For production, deploy your backend to the same server as your database (Hostinger):

1. **Upload backend code to Hostinger**
2. **Use localhost for DB_HOST:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=u530425252_clarifyall
   DB_PASSWORD=&631^1HXVzqE
   DB_NAME=u530425252_clarifyall
   ```
3. **No remote connection needed!**

---

## Summary of Steps

1. ✅ **Whitelist your IP in Hostinger Remote MySQL** (Most important!)
2. ✅ Verify credentials in `.env` file
3. ✅ Check firewall settings
4. ✅ Run test-connection.js to verify
5. ✅ If still failing, use local MySQL for development
6. ✅ Deploy to Hostinger for production (no remote connection needed)

---

## Need Help?

If you're still having issues:
1. Run `node backend/test-connection.js` and share the output
2. Check if you can connect via MySQL Workbench
3. Contact Hostinger support to verify Remote MySQL is enabled
4. Consider using local MySQL for development

---

**Most Common Fix:** Whitelist your IP in Hostinger cPanel → Remote MySQL!
