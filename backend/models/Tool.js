const { query } = require('../config/database');

class Tool {
  // Get all tools with filters and pagination
  static async findAll(filters = {}) {
    const { 
      page = 0, 
      size = 12, 
      pricingModel, 
      categoryId, 
      searchTerm,
      status = 'APPROVED',
      platforms,
      featureTags,
      sortBy = 'RECENT'
    } = filters;

    const offset = page * size;
    let sql = `
      SELECT DISTINCT t.*, 
        GROUP_CONCAT(DISTINCT c.id) as category_ids,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM tools t
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      LEFT JOIN categories c ON tc.category_id = c.id
    `;
    const params = [];
    
    // Add WHERE clause only if status is specified
    if (status !== null) {
      sql += ' WHERE t.status = ?';
      params.push(status);
    } else {
      sql += ' WHERE 1=1'; // Always true, allows adding more conditions
    }

    // Add pricing filter
    if (pricingModel) {
      sql += ' AND t.pricing_model = ?';
      params.push(pricingModel);
    }

    // Add category filter
    if (categoryId) {
      sql += ' AND tc.category_id = ?';
      params.push(categoryId);
    }

    // Add search filter
    if (searchTerm) {
      sql += ' AND (t.name LIKE ? OR t.short_description LIKE ?)';
      const searchPattern = `%${searchTerm}%`;
      params.push(searchPattern, searchPattern);
    }

    // Add platform filter
    if (platforms && platforms.length > 0) {
      sql += ' AND (';
      const platformConditions = platforms.map(() => 'JSON_CONTAINS(t.platforms, ?)').join(' OR ');
      sql += platformConditions + ')';
      platforms.forEach(platform => params.push(JSON.stringify(platform)));
    }

    // Add feature tags filter
    if (featureTags && featureTags.length > 0) {
      sql += ' AND (';
      const tagConditions = featureTags.map(() => 'JSON_CONTAINS(t.feature_tags, ?)').join(' OR ');
      sql += tagConditions + ')';
      featureTags.forEach(tag => params.push(JSON.stringify(tag)));
    }

    // Add sorting
    let orderBy = 't.created_at DESC'; // Default
    switch(sortBy) {
      case 'POPULAR':
        orderBy = 't.view_count DESC';
        break;
      case 'RATING':
        orderBy = 't.rating DESC, t.review_count DESC';
        break;
      case 'NAME_ASC':
        orderBy = 't.name ASC';
        break;
      case 'NAME_DESC':
        orderBy = 't.name DESC';
        break;
      case 'RECENT':
      default:
        orderBy = 't.created_at DESC';
    }

    sql += ` GROUP BY t.id ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(size, offset);

    const tools = await query(sql, params);

    // Get total count
    let countSql = `
      SELECT COUNT(DISTINCT t.id) as total
      FROM tools t
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
    `;
    const countParams = [];
    
    // Add WHERE clause only if status is specified
    if (status !== null) {
      countSql += ' WHERE t.status = ?';
      countParams.push(status);
    } else {
      countSql += ' WHERE 1=1'; // Always true, allows adding more conditions
    }

    if (pricingModel) {
      countSql += ' AND t.pricing_model = ?';
      countParams.push(pricingModel);
    }

    if (categoryId) {
      countSql += ' AND tc.category_id = ?';
      countParams.push(categoryId);
    }

    if (searchTerm) {
      countSql += ' AND (t.name LIKE ? OR t.short_description LIKE ?)';
      const searchPattern = `%${searchTerm}%`;
      countParams.push(searchPattern, searchPattern);
    }

    if (platforms && platforms.length > 0) {
      countSql += ' AND (';
      const platformConditions = platforms.map(() => 'JSON_CONTAINS(t.platforms, ?)').join(' OR ');
      countSql += platformConditions + ')';
      platforms.forEach(platform => countParams.push(JSON.stringify(platform)));
    }

    if (featureTags && featureTags.length > 0) {
      countSql += ' AND (';
      const tagConditions = featureTags.map(() => 'JSON_CONTAINS(t.feature_tags, ?)').join(' OR ');
      countSql += tagConditions + ')';
      featureTags.forEach(tag => countParams.push(JSON.stringify(tag)));
    }

    const countResult = await query(countSql, countParams);
    const total = countResult[0].total;

    // Format tools with categories
    const formattedTools = tools.map(tool => this.formatTool(tool));

    return {
      content: formattedTools,
      totalElements: total,
      totalPages: Math.ceil(total / size),
      currentPage: page,
      pageSize: size
    };
  }

  // Get tool by ID
  static async findById(id) {
    const sql = `
      SELECT t.*, 
        GROUP_CONCAT(DISTINCT c.id) as category_ids,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM tools t
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE t.id = ?
      GROUP BY t.id
    `;
    const results = await query(sql, [id]);
    return results[0] ? this.formatTool(results[0]) : null;
  }

  // Create new tool
  static async create(toolData) {
    const {
      name,
      websiteUrl,
      shortDescription,
      fullDescription,
      logoUrl,
      pricingModel,
      submitterEmail,
      categoryIds,
      screenshots,
      videoUrl,
      socialLinks,
      features,
      pricingDetails,
      platforms,
      featureTags
    } = toolData;

    const sql = `
      INSERT INTO tools 
      (name, website_url, short_description, full_description, logo_url, pricing_model, submitter_email, 
       status, screenshots, video_url, social_links, features, pricing_details, platforms, feature_tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL', ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      name,
      websiteUrl,
      shortDescription,
      fullDescription || null,
      logoUrl,
      pricingModel,
      submitterEmail,
      screenshots ? JSON.stringify(screenshots) : null,
      videoUrl || null,
      socialLinks ? JSON.stringify(socialLinks) : null,
      features ? JSON.stringify(features) : null,
      pricingDetails ? JSON.stringify(pricingDetails) : null,
      platforms ? JSON.stringify(platforms) : null,
      featureTags ? JSON.stringify(featureTags) : null
    ]);

    const toolId = result.insertId;

    // Add categories
    if (categoryIds && categoryIds.length > 0) {
      await this.addCategories(toolId, categoryIds);
    }

    return await this.findById(toolId);
  }

  // Add categories to tool
  static async addCategories(toolId, categoryIds) {
    // Insert each category individually
    for (const categoryId of categoryIds) {
      const sql = 'INSERT INTO tool_categories (tool_id, category_id) VALUES (?, ?)';
      await query(sql, [toolId, categoryId]);
    }
  }

  // Increment view count
  static async incrementViewCount(id) {
    const sql = 'UPDATE tools SET view_count = view_count + 1 WHERE id = ?';
    await query(sql, [id]);
    const tool = await this.findById(id);
    return tool ? tool.view_count : 0;
  }

  // Increment save count
  static async incrementSaveCount(id) {
    const sql = 'UPDATE tools SET save_count = save_count + 1 WHERE id = ?';
    await query(sql, [id]);
    const tool = await this.findById(id);
    return tool ? tool.save_count : 0;
  }

  // Get popular tools
  static async findPopular(limit = 10) {
    const sql = `
      SELECT t.*, 
        GROUP_CONCAT(DISTINCT c.id) as category_ids,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM tools t
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE t.status = 'APPROVED'
      GROUP BY t.id
      ORDER BY t.view_count DESC
      LIMIT ?
    `;
    const tools = await query(sql, [limit]);
    return tools.map(tool => this.formatTool(tool));
  }

  // Get recent tools
  static async findRecent(limit = 10) {
    const sql = `
      SELECT t.*, 
        GROUP_CONCAT(DISTINCT c.id) as category_ids,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM tools t
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE t.status = 'APPROVED'
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT ?
    `;
    const tools = await query(sql, [limit]);
    return tools.map(tool => this.formatTool(tool));
  }

  // Update tool status (for admin approval/rejection)
  static async updateStatus(id, status) {
    const sql = 'UPDATE tools SET status = ?, updated_at = NOW() WHERE id = ?';
    await query(sql, [status, id]);
    return await this.findById(id);
  }

  // Delete tool
  static async delete(id) {
    // First delete category associations
    await query('DELETE FROM tool_categories WHERE tool_id = ?', [id]);
    
    // Then delete the tool
    const sql = 'DELETE FROM tools WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Get similar tools (by category)
  static async findSimilar(toolId, categoryIds, limit = 4) {
    if (!categoryIds || categoryIds.length === 0) return [];
    
    const placeholders = categoryIds.map(() => '?').join(',');
    const sql = `
      SELECT DISTINCT t.*, 
        GROUP_CONCAT(DISTINCT c.id) as category_ids,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.slug) as category_slugs
      FROM tools t
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE t.status = 'APPROVED' 
        AND t.id != ?
        AND tc.category_id IN (${placeholders})
      GROUP BY t.id
      ORDER BY t.view_count DESC
      LIMIT ?
    `;
    const tools = await query(sql, [toolId, ...categoryIds, limit]);
    return tools.map(tool => this.formatTool(tool));
  }

  // Format tool with categories
  static formatTool(tool) {
    const categories = [];
    if (tool.category_ids) {
      const ids = tool.category_ids.split(',');
      const names = tool.category_names.split(',');
      const slugs = tool.category_slugs.split(',');
      
      for (let i = 0; i < ids.length; i++) {
        categories.push({
          id: parseInt(ids[i]),
          name: names[i],
          slug: slugs[i]
        });
      }
    }

    // Parse JSON fields
    let screenshots = null;
    let socialLinks = null;
    let features = null;
    let pricingDetails = null;
    let platforms = null;
    let featureTags = null;

    try {
      if (tool.screenshots) screenshots = JSON.parse(tool.screenshots);
      if (tool.social_links) socialLinks = JSON.parse(tool.social_links);
      if (tool.features) features = JSON.parse(tool.features);
      if (tool.pricing_details) pricingDetails = JSON.parse(tool.pricing_details);
      if (tool.platforms) platforms = JSON.parse(tool.platforms);
      if (tool.feature_tags) featureTags = JSON.parse(tool.feature_tags);
    } catch (e) {
      console.error('Error parsing JSON fields:', e);
    }

    return {
      id: tool.id,
      name: tool.name,
      websiteUrl: tool.website_url,
      shortDescription: tool.short_description,
      fullDescription: tool.full_description,
      logoUrl: tool.logo_url,
      pricingModel: tool.pricing_model,
      status: tool.status,
      submitterEmail: tool.submitter_email,
      viewCount: tool.view_count,
      saveCount: tool.save_count,
      rating: tool.rating || 0,
      reviewCount: tool.review_count || 0,
      categories: categories,
      screenshots: screenshots,
      videoUrl: tool.video_url,
      socialLinks: socialLinks,
      features: features,
      pricingDetails: pricingDetails,
      platforms: platforms,
      featureTags: featureTags,
      createdAt: tool.created_at,
      updatedAt: tool.updated_at
    };
  }
}

module.exports = Tool;
