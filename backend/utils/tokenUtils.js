const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

class TokenUtils {
  // Generate JWT token
  static generateToken(userId, email) {
    return jwt.sign(
      { userId, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
  
  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
  
  // Generate random token for email verification or password reset
  static generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  // Generate password reset token with expiry
  static generateResetToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token expires in 1 hour
    
    return { token, expiry };
  }
  
  // Decode token without verification (for debugging)
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = TokenUtils;
