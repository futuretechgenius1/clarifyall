const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('='.repeat(60));
  console.log('MySQL Connection Test for Clarifyall');
  console.log('='.repeat(60));
  console.log('');
  
  const config = {
    host: 'srv1148.hstgr.io',
    port: 3306,
    user: 'u530425252_clarifyall',
    password: '&631^1HXVzqE',
    database: 'u530425252_clarifyall',
    connectTimeout: 10000
  };
  
  console.log('Connection Configuration:');
  console.log('-'.repeat(60));
  console.log(`Host:     ${config.host}`);
  console.log(`Port:     ${config.port}`);
  console.log(`User:     ${config.user}`);
  console.log(`Database: ${config.database}`);
  console.log(`Timeout:  ${config.connectTimeout}ms`);
  console.log('');
  
  try {
    console.log('⏳ Attempting to connect...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection established successfully!');
    console.log('');
    
    console.log('⏳ Testing query execution...');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Query executed successfully!');
    console.log('   Result:', rows[0]);
    console.log('');
    
    console.log('⏳ Checking database tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('✅ Tables in database:');
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found. Run: npm run init-db');
    } else {
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }
    console.log('');
    
    await connection.end();
    console.log('✅ Connection closed gracefully');
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ ALL TESTS PASSED! Database connection is working.');
    console.log('='.repeat(60));
    console.log('');
    console.log('Next steps:');
    console.log('1. If no tables found, run: npm run init-db');
    console.log('2. Start the server: npm run dev');
    console.log('3. Test API: curl http://localhost:8080/api/v1/health');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.log('');
    console.log('='.repeat(60));
    console.log('❌ CONNECTION FAILED!');
    console.log('='.repeat(60));
    console.log('');
    console.log('Error Details:');
    console.log(`  Code:    ${error.code || 'N/A'}`);
    console.log(`  Message: ${error.message || 'N/A'}`);
    console.log(`  Errno:   ${error.errno || 'N/A'}`);
    console.log('');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔍 Diagnosis: Connection Refused');
      console.log('');
      console.log('This means the MySQL server is not accepting connections.');
      console.log('');
      console.log('Most Common Causes:');
      console.log('');
      console.log('1. ⚠️  IP NOT WHITELISTED (Most Likely!)');
      console.log('   Solution:');
      console.log('   a. Login to Hostinger cPanel (https://hpanel.hostinger.com)');
      console.log('   b. Go to: Databases → Remote MySQL');
      console.log('   c. Add your current IP address');
      console.log('   d. Get your IP: curl ifconfig.me');
      console.log('   e. Or visit: https://whatismyipaddress.com/');
      console.log('');
      console.log('2. ⚠️  FIREWALL BLOCKING PORT 3306');
      console.log('   Solution:');
      console.log('   - Windows: Allow port 3306 in Windows Firewall');
      console.log('   - Mac/Linux: Check firewall settings');
      console.log('');
      console.log('3. ⚠️  WRONG HOST OR PORT');
      console.log('   Solution:');
      console.log('   - Verify in Hostinger cPanel → MySQL Databases');
      console.log('   - Check Remote MySQL section for correct hostname');
      console.log('');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('🔍 Diagnosis: Access Denied');
      console.log('');
      console.log('Wrong username or password.');
      console.log('');
      console.log('Solution:');
      console.log('1. Verify credentials in .env file');
      console.log('2. Check Hostinger cPanel for correct username/password');
      console.log('');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('🔍 Diagnosis: Connection Timeout');
      console.log('');
      console.log('The connection attempt timed out.');
      console.log('');
      console.log('Possible causes:');
      console.log('1. Firewall blocking connection');
      console.log('2. Network issues');
      console.log('3. MySQL service down');
      console.log('');
    } else {
      console.log('🔍 Diagnosis: Unknown Error');
      console.log('');
      console.log('Please check:');
      console.log('1. Internet connection');
      console.log('2. Hostinger service status');
      console.log('3. Contact Hostinger support');
      console.log('');
    }
    
    console.log('='.repeat(60));
    console.log('📚 For detailed troubleshooting, see:');
    console.log('   backend/TROUBLESHOOTING.md');
    console.log('='.repeat(60));
    console.log('');
    console.log('💡 Quick Fix for Development:');
    console.log('   Use local MySQL instead of remote Hostinger database');
    console.log('   See TROUBLESHOOTING.md for instructions');
    console.log('');
    
    process.exit(1);
  }
}

testConnection();
