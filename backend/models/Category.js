const { query } = require('../config/database');

class Category {
  // Get all categories
  static async findAll() {
    const sql = 'SELECT * FROM categories ORDER BY name ASC';
    return await query(sql);
  }

  // Get category by ID
  static async findById(id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0];
  }

  // Get category by slug
  static async findBySlug(slug) {
    const sql = 'SELECT * FROM categories WHERE slug = ?';
    const results = await query(sql, [slug]);
    return results[0];
  }

  // Create new category
  static async create(categoryData) {
    const { name, slug, description } = categoryData;
    const sql = 'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)';
    const result = await query(sql, [name, slug, description]);
    return result.insertId;
  }

  // Update category
  static async update(id, categoryData) {
    const { name, slug, description } = categoryData;
    const sql = 'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?';
    await query(sql, [name, slug, description, id]);
    return await this.findById(id);
  }

  // Delete category
  static async delete(id) {
    const sql = 'DELETE FROM categories WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Check if category exists by slug
  static async existsBySlug(slug) {
    const sql = 'SELECT COUNT(*) as count FROM categories WHERE slug = ?';
    const results = await query(sql, [slug]);
    return results[0].count > 0;
  }
}

module.exports = Category;
