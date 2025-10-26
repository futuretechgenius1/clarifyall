const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'srv1148.hstgr.io',
    user: process.env.DB_USER || 'u530425252_clarifyall',
    password: process.env.DB_PASSWORD || '&631^1HXVzqE',
    database: process.env.DB_NAME || 'u530425252_kyc'
  });

  try {
    console.log('Connected to database. Applying schema updates...');

    // Check if columns already exist before adding
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tools'
    `, [process.env.DB_NAME || 'u530425252_kyc']);

    const existingColumns = columns.map(col => col.COLUMN_NAME);

    // Add screenshots column
    if (!existingColumns.includes('screenshots')) {
      await connection.query('ALTER TABLE tools ADD COLUMN screenshots TEXT');
      console.log('✓ Added screenshots column');
    } else {
      console.log('- screenshots column already exists');
    }

    // Add video_url column
    if (!existingColumns.includes('video_url')) {
      await connection.query('ALTER TABLE tools ADD COLUMN video_url VARCHAR(500)');
      console.log('✓ Added video_url column');
    } else {
      console.log('- video_url column already exists');
    }

    // Add social_links column
    if (!existingColumns.includes('social_links')) {
      await connection.query('ALTER TABLE tools ADD COLUMN social_links TEXT');
      console.log('✓ Added social_links column');
    } else {
      console.log('- social_links column already exists');
    }

    // Add features column
    if (!existingColumns.includes('features')) {
      await connection.query('ALTER TABLE tools ADD COLUMN features TEXT');
      console.log('✓ Added features column');
    } else {
      console.log('- features column already exists');
    }

    // Add pricing_details column
    if (!existingColumns.includes('pricing_details')) {
      await connection.query('ALTER TABLE tools ADD COLUMN pricing_details TEXT');
      console.log('✓ Added pricing_details column');
    } else {
      console.log('- pricing_details column already exists');
    }

    // Add platforms column
    if (!existingColumns.includes('platforms')) {
      await connection.query('ALTER TABLE tools ADD COLUMN platforms TEXT');
      console.log('✓ Added platforms column');
    } else {
      console.log('- platforms column already exists');
    }

    // Add feature_tags column
    if (!existingColumns.includes('feature_tags')) {
      await connection.query('ALTER TABLE tools ADD COLUMN feature_tags TEXT');
      console.log('✓ Added feature_tags column');
    } else {
      console.log('- feature_tags column already exists');
    }

    // Add rating column
    if (!existingColumns.includes('rating')) {
      await connection.query('ALTER TABLE tools ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00');
      console.log('✓ Added rating column');
    } else {
      console.log('- rating column already exists');
    }

    // Add review_count column
    if (!existingColumns.includes('review_count')) {
      await connection.query('ALTER TABLE tools ADD COLUMN review_count INT DEFAULT 0');
      console.log('✓ Added review_count column');
    } else {
      console.log('- review_count column already exists');
    }

    // Create indexes if they don't exist
    try {
      await connection.query('CREATE INDEX idx_tools_rating ON tools(rating)');
      console.log('✓ Created index on rating');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('- Index on rating already exists');
      } else {
        throw err;
      }
    }

    try {
      await connection.query('CREATE INDEX idx_tools_created_at ON tools(created_at)');
      console.log('✓ Created index on created_at');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('- Index on created_at already exists');
      } else {
        throw err;
      }
    }

    try {
      await connection.query('CREATE INDEX idx_tools_view_count ON tools(view_count)');
      console.log('✓ Created index on view_count');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('- Index on view_count already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Schema update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating schema:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the update
updateSchema()
  .then(() => {
    console.log('\n🎉 Database schema is up to date!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to update schema:', error);
    process.exit(1);
  });
