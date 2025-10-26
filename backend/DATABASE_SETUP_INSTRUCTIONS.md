# Database Setup Instructions

This guide explains how to set up your Clarifyall database using the provided SQL script.

## 📋 Database Information

**Your Hostinger Database:**
```
Host: srv1148.hstgr.io
Port: 3306
Database: u530425252_clarifyall
Username: u530425252_clarifyall
Password: &631^1HXVzqE
```

## 🚀 Method 1: Using Hostinger phpMyAdmin (Easiest)

### Step 1: Login to Hostinger cPanel
1. Go to your Hostinger control panel
2. Login with your credentials

### Step 2: Open phpMyAdmin
1. Find "Databases" section
2. Click on "phpMyAdmin"
3. Select database `u530425252_clarifyall` from the left sidebar

### Step 3: Import SQL Script
1. Click on the "SQL" tab at the top
2. Open the file `backend/database-setup.sql` in a text editor
3. Copy ALL the content
4. Paste it into the SQL query box
5. Click "Go" button at the bottom

### Step 4: Verify Installation
You should see success messages and a summary showing:
- Categories: 25 rows
- Tools: 5 rows (sample data)
- Tool_Categories: 9 rows

**✅ Done! Your database is ready.**

---

## 🚀 Method 2: Using MySQL Command Line

### Step 1: Connect to Database
```bash
mysql -h srv1148.hstgr.io -u u530425252_clarifyall -p u530425252_clarifyall
```

When prompted, enter password: `&631^1HXVzqE`

### Step 2: Run SQL Script
```bash
source /path/to/backend/database-setup.sql
```

Or copy-paste the entire script content.

### Step 3: Verify
```sql
-- Check tables
SHOW TABLES;

-- Check categories count
SELECT COUNT(*) FROM categories;

-- Check tools count
SELECT COUNT(*) FROM tools;

-- View all categories
SELECT id, name FROM categories;
```

**✅ Done! Your database is ready.**

---

## 🚀 Method 3: Using MySQL Workbench

### Step 1: Create New Connection
1. Open MySQL Workbench
2. Click "+" to create new connection
3. Enter connection details:
   - Connection Name: Clarifyall Hostinger
   - Hostname: srv1148.hstgr.io
   - Port: 3306
   - Username: u530425252_clarifyall
   - Password: (click "Store in Keychain" and enter: &631^1HXVzqE)
4. Click "Test Connection"
5. Click "OK"

### Step 2: Open SQL Script
1. Double-click the connection to open
2. Select database `u530425252_clarifyall`
3. Go to File → Open SQL Script
4. Select `backend/database-setup.sql`
5. Click the lightning bolt icon (⚡) to execute

### Step 3: Verify
Check the output panel for success messages.

**✅ Done! Your database is ready.**

---

## 🚀 Method 4: Using Node.js Script (Automated)

### Step 1: Setup Backend
```bash
cd backend
npm install
```

### Step 2: Create .env File
```bash
# Copy production config
copy .env.production .env
# (On Mac/Linux: cp .env.production .env)
```

### Step 3: Run Initialization Script
```bash
npm run init-db
```

This will:
- Connect to your Hostinger database
- Create all tables
- Insert 25 categories
- Show success message

**✅ Done! Your database is ready.**

---

## 📊 What Gets Created

### Tables (3)

**1. categories**
- Stores 25 AI tool categories
- Fields: id, name, slug, description, timestamps

**2. tools**
- Stores AI tool information
- Fields: id, name, website_url, descriptions, logo_url, pricing_model, status, email, counts, timestamps

**3. tool_categories**
- Links tools to categories (many-to-many)
- Fields: tool_id, category_id

### Sample Data

**Categories (25):**
1. Chatbots & Virtual Companions
2. Image Generation & Editing
3. Writing & Editing
4. Coding & Development
5. Office & Productivity
6. Video & Animation
7. Marketing & Advertising
8. Audio & Music
9. Data Analysis & Visualization
10. Customer Support & CRM
11. Education & Learning
12. Healthcare & Medical
13. Finance & Accounting
14. Legal & Compliance
15. Human Resources
16. Sales & Lead Generation
17. Social Media Management
18. SEO & Content Optimization
19. E-commerce & Retail
20. Gaming & Entertainment
21. Research & Development
22. Translation & Localization
23. Cybersecurity
24. Real Estate & Property
25. Travel & Hospitality

**Sample Tools (5):**
1. ChatGPT - Conversational AI (Freemium)
2. Midjourney - Image Generation (Paid)
3. GitHub Copilot - Code Assistant (Paid)
4. Grammarly - Writing Assistant (Freemium)
5. Jasper AI - Content Creation (Paid)

---

## ✅ Verification Queries

After running the script, verify everything is set up correctly:

### Check Table Structure
```sql
SHOW TABLES;
```

Expected output:
```
+----------------------------------+
| Tables_in_u530425252_clarifyall |
+----------------------------------+
| categories                       |
| tool_categories                  |
| tools                            |
+----------------------------------+
```

### Check Categories
```sql
SELECT COUNT(*) as total FROM categories;
```

Expected: 25 categories

### Check Tools
```sql
SELECT COUNT(*) as total FROM tools;
```

Expected: 5 sample tools (or 0 if you removed sample data)

### View All Categories
```sql
SELECT id, name, slug FROM categories ORDER BY name;
```

### View All Tools with Categories
```sql
SELECT 
    t.id,
    t.name,
    t.pricing_model,
    t.status,
    GROUP_CONCAT(c.name SEPARATOR ', ') as categories
FROM tools t
LEFT JOIN tool_categories tc ON t.id = tc.tool_id
LEFT JOIN categories c ON tc.category_id = c.id
GROUP BY t.id
ORDER BY t.created_at DESC;
```

---

## 🔧 Troubleshooting

### Error: "Access denied"
**Solution:** Verify your credentials are correct:
- Username: u530425252_clarifyall
- Password: &631^1HXVzqE
- Database: u530425252_clarifyall

### Error: "Can't connect to MySQL server"
**Solutions:**
1. Check if your IP is whitelisted in Hostinger cPanel → Remote MySQL
2. Verify hostname: srv1148.hstgr.io
3. Check if port 3306 is not blocked by firewall

### Error: "Table already exists"
**Solution:** The script includes DROP TABLE statements. If you still get this error:
```sql
DROP TABLE IF EXISTS tool_categories;
DROP TABLE IF EXISTS tools;
DROP TABLE IF EXISTS categories;
```
Then run the script again.

### Error: "Unknown database"
**Solution:** Make sure you're connected to the correct database:
```sql
USE u530425252_clarifyall;
```

---

## 🗑️ Reset Database (If Needed)

To completely reset and start fresh:

```sql
-- Drop all tables
DROP TABLE IF EXISTS tool_categories;
DROP TABLE IF EXISTS tools;
DROP TABLE IF EXISTS categories;

-- Then run the database-setup.sql script again
```

---

## 📝 Customization

### Remove Sample Tools

If you don't want the 5 sample tools, edit `database-setup.sql` and comment out or remove this section:

```sql
-- ============================================
-- 6. INSERT SAMPLE TOOLS (Optional - for testing)
-- ============================================
```

### Add More Categories

To add custom categories, add to the INSERT statement:

```sql
INSERT INTO categories (name, slug, description) VALUES
('Your Category', 'your-category', 'Description here');
```

---

## 🎯 Next Steps

After database setup:

1. ✅ Database is ready
2. ✅ Create `.env` file in backend directory
3. ✅ Start backend server: `npm run dev`
4. ✅ Start frontend: `cd frontend && npm start`
5. ✅ Test the application

---

## 📚 Additional Resources

- **Backend Setup:** See `LOCAL_SETUP_GUIDE.md`
- **API Documentation:** See `API_DOCUMENTATION.md`
- **Production Deployment:** See `PRODUCTION_CONFIG.md`

---

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your Hostinger database credentials
3. Ensure your IP is whitelisted for remote MySQL access
4. Check Hostinger support documentation

---

**Database Provider:** Hostinger  
**Setup Time:** ~2 minutes  
**Tables Created:** 3  
**Initial Data:** 25 categories + 5 sample tools
