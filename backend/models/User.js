const { pool: db } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    const { email, password, name, provider = 'local', providerId = null } = userData;
    
    // Hash password if provided (for local auth)
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    const query = `
      INSERT INTO users (email, password, name, provider, providerId, isVerified)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      email,
      hashedPassword,
      name,
      provider,
      providerId,
      true // All users are auto-verified (email verification disabled)
    ]);
    
    return result.insertId;
  }
  
  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) return null;
    
    // Remove password from returned user object
    const user = rows[0];
    delete user.password;
    return user;
  }
  
  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }
  
  // Find user by provider and providerId (for OAuth)
  static async findByProvider(provider, providerId) {
    const query = 'SELECT * FROM users WHERE provider = ? AND providerId = ?';
    const [rows] = await db.execute(query, [provider, providerId]);
    
    if (rows.length === 0) return null;
    
    const user = rows[0];
    delete user.password;
    return user;
  }
  
  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // Update user profile
  static async updateProfile(userId, updates) {
    const allowedFields = ['name', 'bio', 'avatar'];
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await db.execute(query, values);
    return await User.findById(userId);
  }
  
  // Set verification token
  static async setVerificationToken(userId, token) {
    const query = 'UPDATE users SET verificationToken = ? WHERE id = ?';
    await db.execute(query, [token, userId]);
  }
  
  // Verify email
  static async verifyEmail(token) {
    const query = 'UPDATE users SET isVerified = TRUE, verificationToken = NULL WHERE verificationToken = ?';
    const [result] = await db.execute(query, [token]);
    return result.affectedRows > 0;
  }
  
  // Set password reset token
  static async setResetToken(email, token, expiry) {
    const query = 'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?';
    await db.execute(query, [token, expiry, email]);
  }
  
  // Reset password
  static async resetPassword(token, newPassword) {
    // Check if token is valid and not expired
    const query = 'SELECT id FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()';
    const [rows] = await db.execute(query, [token]);
    
    if (rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }
    
    const userId = rows[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const updateQuery = 'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?';
    await db.execute(updateQuery, [hashedPassword, userId]);
    
    return true;
  }
  
  // Change password (for logged-in users)
  static async changePassword(userId, oldPassword, newPassword) {
    const query = 'SELECT password FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [userId]);
    
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    
    const isValid = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
    await db.execute(updateQuery, [hashedPassword, userId]);
    
    return true;
  }
  
  // Get user's submitted tools
  static async getUserTools(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT t.*, 
        GROUP_CONCAT(c.name) as categoryNames
      FROM tools t
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE t.submitter_email = (SELECT email FROM users WHERE id = ?)
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [tools] = await db.execute(query, [userId, limit, offset]);
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM tools WHERE submitter_email = (SELECT email FROM users WHERE id = ?)';
    const [countResult] = await db.execute(countQuery, [userId]);
    
    return {
      tools,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }
  
  // Save/bookmark a tool
  static async saveTool(userId, toolId) {
    const query = 'INSERT INTO user_saved_tools (userId, toolId) VALUES (?, ?)';
    try {
      await db.execute(query, [userId, toolId]);
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return false; // Already saved
      }
      throw error;
    }
  }
  
  // Unsave/unbookmark a tool
  static async unsaveTool(userId, toolId) {
    const query = 'DELETE FROM user_saved_tools WHERE userId = ? AND toolId = ?';
    const [result] = await db.execute(query, [userId, toolId]);
    return result.affectedRows > 0;
  }
  
  // Get user's saved tools
  static async getSavedTools(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT t.*, 
        GROUP_CONCAT(c.name) as categoryNames,
        ust.savedAt
      FROM user_saved_tools ust
      JOIN tools t ON ust.toolId = t.id
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE ust.userId = ?
      GROUP BY t.id
      ORDER BY ust.savedAt DESC
      LIMIT ? OFFSET ?
    `;
    
    const [tools] = await db.execute(query, [userId, limit, offset]);
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM user_saved_tools WHERE userId = ?';
    const [countResult] = await db.execute(countQuery, [userId]);
    
    return {
      tools,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }
  
  // Check if user has saved a tool
  static async hasSavedTool(userId, toolId) {
    const query = 'SELECT id FROM user_saved_tools WHERE userId = ? AND toolId = ?';
    const [rows] = await db.execute(query, [userId, toolId]);
    return rows.length > 0;
  }
  
  // Delete user account
  static async deleteAccount(userId) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.execute(query, [userId]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
