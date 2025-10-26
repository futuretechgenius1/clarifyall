# Clarifyall Backend - Node.js/Express API

RESTful API backend for the Clarifyall AI Tool Directory platform.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL 8.x
- **File Upload:** Multer
- **Validation:** express-validator

## 📋 Prerequisites

- Node.js 16+ and npm
- MySQL 8.x
- Git (optional)

## 🔧 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=8080
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clarifyall_db

UPLOAD_DIR=uploads/logos
MAX_FILE_SIZE=5242880

CORS_ORIGIN=http://localhost:3000
```

### 3. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE clarifyall_db;
EXIT;
```

### 4. Initialize Database

This will create tables and seed initial categories:

```bash
npm run init-db
```

### 5. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:8080`

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # Database connection & setup
│   └── multer.js            # File upload configuration
├── models/
│   ├── Category.js          # Category model
│   └── Tool.js              # Tool model
├── routes/
│   ├── categoryRoutes.js    # Category endpoints
│   ├── toolRoutes.js        # Tool endpoints
│   └── fileRoutes.js        # File serving endpoints
├── scripts/
│   └── initDatabase.js      # Database initialization script
├── uploads/logos/           # Uploaded logo files
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── server.js               # Main application file
└── README.md               # This file
```

## 🔌 API Endpoints

### Health Check
- `GET /api/v1/health` - Server health status

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `GET /api/v1/categories/slug/:slug` - Get category by slug

### Tools
- `GET /api/v1/tools` - Get all tools (with filters)
  - Query params: `page`, `size`, `pricingModel`, `categoryId`, `searchTerm`
- `GET /api/v1/tools/:id` - Get tool by ID
- `POST /api/v1/tools/submit` - Submit new tool (multipart/form-data)
- `POST /api/v1/tools/:id/view` - Increment view count
- `POST /api/v1/tools/:id/save` - Increment save count
- `GET /api/v1/tools/popular` - Get popular tools
- `GET /api/v1/tools/recent` - Get recent tools

### Files
- `GET /api/v1/files/logos/:filename` - Serve logo file

## 📝 API Examples

### Get All Tools with Filters

```bash
curl "http://localhost:8080/api/v1/tools?page=0&size=12&pricingModel=FREE&searchTerm=chatbot"
```

### Submit a Tool

```bash
curl -X POST http://localhost:8080/api/v1/tools/submit \
  -F 'toolData={"name":"ChatGPT","websiteUrl":"https://chat.openai.com","categoryIds":[1,3],"pricingModel":"FREEMIUM","shortDescription":"A powerful conversational AI","submitterEmail":"user@example.com"}' \
  -F 'logo=@/path/to/logo.png'
```

### Get All Categories

```bash
curl http://localhost:8080/api/v1/categories
```

## 🗄️ Database Schema

### Tables

**categories**
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR, UNIQUE)
- slug (VARCHAR, UNIQUE)
- description (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**tools**
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR)
- website_url (VARCHAR)
- short_description (VARCHAR)
- full_description (TEXT)
- logo_url (VARCHAR)
- pricing_model (ENUM: FREE, FREEMIUM, FREE_TRIAL, PAID)
- status (ENUM: PENDING_APPROVAL, APPROVED, REJECTED)
- submitter_email (VARCHAR)
- view_count (INT)
- save_count (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**tool_categories** (Junction Table)
- tool_id (INT, FOREIGN KEY)
- category_id (INT, FOREIGN KEY)
- PRIMARY KEY (tool_id, category_id)

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| NODE_ENV | Environment | development |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | root |
| DB_NAME | Database name | clarifyall_db |
| UPLOAD_DIR | Upload directory | uploads/logos |
| MAX_FILE_SIZE | Max file size (bytes) | 5242880 (5MB) |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |

## 🧪 Testing

### Test Database Connection

```bash
node -e "require('./config/database').testConnection()"
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:8080/api/v1/health

# Get categories
curl http://localhost:8080/api/v1/categories

# Get tools
curl http://localhost:8080/api/v1/tools
```

## 🐛 Troubleshooting

### Port Already in Use

Change the PORT in `.env`:
```env
PORT=8081
```

### Database Connection Error

1. Verify MySQL is running
2. Check credentials in `.env`
3. Ensure database exists

### File Upload Error

Ensure `uploads/logos` directory exists and has write permissions:
```bash
mkdir -p uploads/logos
chmod 755 uploads/logos
```

## 📚 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database and seed data

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name clarifyall-api
pm2 save
pm2 startup
```

### Using Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ using Node.js and Express**
