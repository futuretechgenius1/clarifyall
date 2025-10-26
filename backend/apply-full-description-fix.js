const mysql = require('mysql2/promise');

async function applyFix() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'clarifyall_db'
    });

    console.log('Connected to database...');

    // Check current column type
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM tools WHERE Field = 'full_description'"
    );
    
    console.log('\nCurrent column definition:');
    console.log(columns[0]);

    // Apply the fix
    console.log('\nApplying fix: Changing full_description to LONGTEXT...');
    await connection.query(
      'ALTER TABLE tools MODIFY COLUMN full_description LONGTEXT'
    );

    console.log('✅ Successfully changed full_description column to LONGTEXT');

    // Verify the change
    const [newColumns] = await connection.query(
      "SHOW COLUMNS FROM tools WHERE Field = 'full_description'"
    );
    
    console.log('\nNew column definition:');
    console.log(newColumns[0]);

    console.log('\n✅ Database migration complete!');
    console.log('\n⚠️  IMPORTANT: You must now re-submit or update the Deepseek tool');
    console.log('   with the complete description. The existing truncated data');
    console.log('   will remain truncated until you update it.');

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyFix();
