-- User Authentication Schema
-- Run this script to add user authentication tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  provider ENUM('local', 'google', 'github') DEFAULT 'local',
  providerId VARCHAR(255) DEFAULT NULL,
  isVerified BOOLEAN DEFAULT FALSE,
  verificationToken VARCHAR(255) DEFAULT NULL,
  resetToken VARCHAR(255) DEFAULT NULL,
  resetTokenExpiry DATETIME DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_provider (provider, providerId),
  INDEX idx_verification (verificationToken),
  INDEX idx_reset (resetToken)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add userId to tools table
ALTER TABLE tools 
ADD COLUMN userId INT DEFAULT NULL,
ADD CONSTRAINT fk_tools_user 
  FOREIGN KEY (userId) REFERENCES users(id) 
  ON DELETE SET NULL;

-- Create index on userId for faster queries
CREATE INDEX idx_tools_user ON tools(userId);

-- Create user_saved_tools table (for bookmarking)
CREATE TABLE IF NOT EXISTS user_saved_tools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  toolId INT NOT NULL,
  savedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (toolId) REFERENCES tools(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_tool (userId, toolId),
  INDEX idx_user_saved (userId),
  INDEX idx_tool_saved (toolId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sessions table (optional, for session management)
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token(255)),
  INDEX idx_user_session (userId),
  INDEX idx_expires (expiresAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
