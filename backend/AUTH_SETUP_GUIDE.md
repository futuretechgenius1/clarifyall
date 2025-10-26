# Authentication Setup Guide

## Phase 1: Backend Setup (Completed ✅)

### Files Created:
1. `database-auth-schema.sql` - Database schema for users and authentication
2. `models/User.js` - User model with authentication methods
3. `utils/tokenUtils.js` - JWT token utilities
4. `middleware/auth.js` - Authentication middleware
5. `config/email.js` - Email configuration and templates
6. `routes/authRoutes.js` - Authentication endpoints
7. `routes/userRoutes.js` - User profile endpoints

### Installation Steps:

#### 1. Install Dependencies
```bash
cd backend
npm install
```

New dependencies installed:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `nodemailer` - Email sending
- `passport` - Authentication middleware
- `passport-local` - Local strategy
- `passport-google-oauth20` - Google OAuth
- `passport-github2` - GitHub OAuth
- `express-session` - Session management
- `cookie-parser` - Cookie parsing

#### 2. Database Setup
Run the authentication schema:
```bash
mysql -u root -p clarifyall_db < database-auth-schema.sql
```

This creates:
- `users` table
- `user_saved_tools` table (for bookmarking)
- `sessions` table
- Updates `tools` table with `userId` foreign key

#### 3. Environment Variables
Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# OAuth Credentials (for Phase 3)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### 4. Gmail App Password Setup
If using Gmail for emails:
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. App Passwords → Generate new app password
4. Use this password in `EMAIL_PASSWORD`

### API Endpoints

#### Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/verify-email/:token` | Verify email | No |
| POST | `/resend-verification` | Resend verification email | Yes |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |
| POST | `/change-password` | Change password (logged in) | Yes |
| GET | `/me` | Get current user | Yes |
| POST | `/logout` | Logout user | Yes |

#### User Endpoints (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:userId` | Get user profile | No |
| PUT | `/profile` | Update profile | Yes |
| POST | `/avatar` | Upload avatar | Yes |
| GET | `/:userId/tools` | Get user's tools | No |
| POST | `/saved-tools/:toolId` | Save/bookmark tool | Yes |
| DELETE | `/saved-tools/:toolId` | Unsave tool | Yes |
| GET | `/saved-tools` | Get saved tools | Yes |
| GET | `/saved-tools/:toolId/check` | Check if tool is saved | Yes |
| DELETE | `/account` | Delete account | Yes |

### Testing the API

#### 1. Register a User
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response includes `token` - use this for authenticated requests.

#### 3. Get Current User (with token)
```bash
curl -X GET http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Update Profile
```bash
curl -X PUT http://localhost:8080/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "bio": "My bio"
  }'
```

### Security Features

✅ Password hashing with bcrypt (10 rounds)
✅ JWT token authentication
✅ Token expiration (7 days)
✅ Email verification
✅ Password reset with expiring tokens (1 hour)
✅ Protected routes with middleware
✅ Input validation
✅ SQL injection prevention (parameterized queries)

### Email Templates

Three email templates are included:
1. **Welcome Email** - Sent after registration
2. **Verification Email** - Email verification link
3. **Password Reset** - Password reset link

### Next Steps

- ✅ Phase 1: Backend Authentication (COMPLETED)
- 🔄 Phase 2: Frontend Authentication UI (IN PROGRESS)
- ⏳ Phase 3: OAuth Integration (Google, GitHub)
- ⏳ Phase 4: Advanced Features (Activity tracking, etc.)

### Troubleshooting

**Email not sending?**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, use App Password, not regular password
- Enable "Less secure app access" if needed

**JWT errors?**
- Ensure JWT_SECRET is set in .env
- Check token format: "Bearer TOKEN"

**Database errors?**
- Run database-auth-schema.sql
- Check database connection in config/database.js
- Verify tables exist: `SHOW TABLES;`

### Support

For issues or questions, check:
- Server logs: `npm run dev`
- Database: `mysql -u root -p clarifyall_db`
- API health: `http://localhost:8080/api/v1/health`
