-- ============================================
-- Clarifyall Database Setup Script
-- ============================================
-- This script creates all necessary tables and seeds initial data
-- Run this in your Hostinger MySQL database: u530425252_clarifyall
-- ============================================

-- Use the database
USE u530425252_clarifyall;

-- ============================================
-- 1. DROP EXISTING TABLES (if they exist)
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS tool_categories;
DROP TABLE IF EXISTS tools;
DROP TABLE IF EXISTS categories;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 2. CREATE CATEGORIES TABLE
-- ============================================

CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. CREATE TOOLS TABLE
-- ============================================

CREATE TABLE tools (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_pricing_model (pricing_model),
  INDEX idx_created_at (created_at),
  INDEX idx_view_count (view_count),
  FULLTEXT INDEX idx_search (name, short_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. CREATE TOOL_CATEGORIES JUNCTION TABLE
-- ============================================

CREATE TABLE tool_categories (
  tool_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (tool_id, category_id),
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_tool_id (tool_id),
  INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. INSERT CATEGORIES (25 AI Tool Categories)
-- ============================================

INSERT INTO categories (name, slug, description) VALUES
('Chatbots & Virtual Companions', 'chatbots-virtual-companions', 'AI-powered conversational agents and virtual assistants'),
('Image Generation & Editing', 'image-generation-editing', 'AI tools for creating and editing images'),
('Writing & Editing', 'writing-editing', 'AI-powered writing assistants and content generators'),
('Coding & Development', 'coding-development', 'AI tools for software development and coding assistance'),
('Office & Productivity', 'office-productivity', 'AI tools to enhance workplace productivity'),
('Video & Animation', 'video-animation', 'AI-powered video creation and animation tools'),
('Marketing & Advertising', 'marketing-advertising', 'AI tools for marketing campaigns and advertising'),
('Audio & Music', 'audio-music', 'AI tools for audio processing and music generation'),
('Data Analysis & Visualization', 'data-analysis-visualization', 'AI-powered data analytics and visualization tools'),
('Customer Support & CRM', 'customer-support-crm', 'AI tools for customer relationship management'),
('Education & Learning', 'education-learning', 'AI-powered educational tools and learning platforms'),
('Healthcare & Medical', 'healthcare-medical', 'AI tools for healthcare and medical applications'),
('Finance & Accounting', 'finance-accounting', 'AI tools for financial analysis and accounting'),
('Legal & Compliance', 'legal-compliance', 'AI tools for legal research and compliance'),
('Human Resources', 'human-resources', 'AI tools for HR management and recruitment'),
('Sales & Lead Generation', 'sales-lead-generation', 'AI tools for sales automation and lead generation'),
('Social Media Management', 'social-media-management', 'AI tools for managing social media presence'),
('SEO & Content Optimization', 'seo-content-optimization', 'AI tools for search engine optimization'),
('E-commerce & Retail', 'ecommerce-retail', 'AI tools for online retail and e-commerce'),
('Gaming & Entertainment', 'gaming-entertainment', 'AI tools for gaming and entertainment'),
('Research & Development', 'research-development', 'AI tools for research and innovation'),
('Translation & Localization', 'translation-localization', 'AI-powered translation and localization tools'),
('Cybersecurity', 'cybersecurity', 'AI tools for security and threat detection'),
('Real Estate & Property', 'real-estate-property', 'AI tools for real estate management'),
('Travel & Hospitality', 'travel-hospitality', 'AI tools for travel and hospitality industry');

-- ============================================
-- 6. INSERT SAMPLE TOOLS (Optional - for testing)
-- ============================================

-- Sample Tool 1: ChatGPT
INSERT INTO tools (name, website_url, short_description, full_description, pricing_model, status, submitter_email, view_count, save_count) VALUES
('ChatGPT', 'https://chat.openai.com', 'A powerful conversational AI for writing, coding, and brainstorming.', 'ChatGPT is an advanced language model developed by OpenAI that can engage in natural conversations, help with writing tasks, answer questions, and assist with coding. It uses GPT-4 architecture to provide intelligent and context-aware responses.', 'FREEMIUM', 'APPROVED', 'admin@clarifyall.com', 1250, 450);

-- Link ChatGPT to categories
INSERT INTO tool_categories (tool_id, category_id) VALUES
(1, 1),  -- Chatbots & Virtual Companions
(1, 3),  -- Writing & Editing
(1, 4);  -- Coding & Development

-- Sample Tool 2: Midjourney
INSERT INTO tools (name, website_url, short_description, full_description, pricing_model, status, submitter_email, view_count, save_count) VALUES
('Midjourney', 'https://www.midjourney.com', 'AI-powered image generation tool for creating stunning artwork.', 'Midjourney is an independent research lab that produces an AI program that creates images from textual descriptions. It is known for generating high-quality, artistic images and is widely used by designers, artists, and content creators.', 'PAID', 'APPROVED', 'admin@clarifyall.com', 980, 320);

-- Link Midjourney to categories
INSERT INTO tool_categories (tool_id, category_id) VALUES
(2, 2),  -- Image Generation & Editing
(2, 7);  -- Marketing & Advertising

-- Sample Tool 3: GitHub Copilot
INSERT INTO tools (name, website_url, short_description, full_description, pricing_model, status, submitter_email, view_count, save_count) VALUES
('GitHub Copilot', 'https://github.com/features/copilot', 'AI pair programmer that helps you write code faster.', 'GitHub Copilot is an AI-powered code completion tool developed by GitHub and OpenAI. It suggests whole lines or blocks of code as you type, helping developers write code faster and with fewer errors. It supports multiple programming languages and integrates directly into popular code editors.', 'PAID', 'APPROVED', 'admin@clarifyall.com', 1100, 380);

-- Link GitHub Copilot to categories
INSERT INTO tool_categories (tool_id, category_id) VALUES
(3, 4);  -- Coding & Development

-- Sample Tool 4: Grammarly
INSERT INTO tools (name, website_url, short_description, full_description, pricing_model, status, submitter_email, view_count, save_count) VALUES
('Grammarly', 'https://www.grammarly.com', 'AI writing assistant for grammar, spelling, and style improvements.', 'Grammarly is a comprehensive writing assistant that uses AI to help improve your writing. It checks for grammar mistakes, spelling errors, punctuation issues, and provides suggestions for clarity, engagement, and delivery. Available as a browser extension, desktop app, and mobile keyboard.', 'FREEMIUM', 'APPROVED', 'admin@clarifyall.com', 1500, 520);

-- Link Grammarly to categories
INSERT INTO tool_categories (tool_id, category_id) VALUES
(4, 3),  -- Writing & Editing
(4, 5);  -- Office & Productivity

-- Sample Tool 5: Jasper AI
INSERT INTO tools (name, website_url, short_description, full_description, pricing_model, status, submitter_email, view_count, save_count) VALUES
('Jasper AI', 'https://www.jasper.ai', 'AI content platform for creating marketing copy and content.', 'Jasper AI is an AI-powered content creation platform designed for marketers, writers, and businesses. It can generate blog posts, social media content, ad copy, emails, and more. With templates and workflows, Jasper helps teams create high-quality content faster.', 'PAID', 'APPROVED', 'admin@clarifyall.com', 850, 290);

-- Link Jasper AI to categories
INSERT INTO tool_categories (tool_id, category_id) VALUES
(5, 3),  -- Writing & Editing
(5, 7),  -- Marketing & Advertising
(5, 8);  -- SEO & Content Optimization

-- ============================================
-- 7. VERIFY INSTALLATION
-- ============================================

-- Show table counts
SELECT 'Categories' as Table_Name, COUNT(*) as Row_Count FROM categories
UNION ALL
SELECT 'Tools', COUNT(*) FROM tools
UNION ALL
SELECT 'Tool_Categories', COUNT(*) FROM tool_categories;

-- Show all categories
SELECT id, name, slug FROM categories ORDER BY name;

-- Show all tools with their categories
SELECT 
    t.id,
    t.name,
    t.pricing_model,
    t.status,
    GROUP_CONCAT(c.name SEPARATOR ', ') as categories
FROM tools t
LEFT JOIN tool_categories tc ON t.id = tc.tool_id
LEFT JOIN categories c ON tc.category_id = c.id
GROUP BY t.id, t.name, t.pricing_model, t.status
ORDER BY t.created_at DESC;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Tables created: categories, tools, tool_categories
-- Categories inserted: 25
-- Sample tools inserted: 5 (optional)
-- ============================================
