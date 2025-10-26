const { query } = require('./config/database');

async function checkAndFixStatus() {
  try {
    console.log('Checking tool status values in database...\n');
    
    // Check current status values
    const tools = await query('SELECT id, name, status, LENGTH(status) as status_length FROM tools');
    
    console.log('Current tools in database:');
    console.log('='.repeat(80));
    tools.forEach(tool => {
      console.log(`ID: ${tool.id}`);
      console.log(`Name: ${tool.name}`);
      console.log(`Status: "${tool.status}" (length: ${tool.status_length})`);
      console.log('-'.repeat(80));
    });
    
    // Fix truncated status values
    console.log('\nFixing any truncated status values...');
    
    const updates = [];
    
    // Fix PENDING_APPROVAL
    const pendingFixed = await query(
      "UPDATE tools SET status = 'PENDING_APPROVAL' WHERE status LIKE 'PENDING_APPROVA%' AND status != 'PENDING_APPROVAL'"
    );
    if (pendingFixed.affectedRows > 0) {
      updates.push(`Fixed ${pendingFixed.affectedRows} PENDING_APPROVAL status(es)`);
    }
    
    // Fix APPROVED
    const approvedFixed = await query(
      "UPDATE tools SET status = 'APPROVED' WHERE status LIKE 'APPROVE%' AND status != 'APPROVED'"
    );
    if (approvedFixed.affectedRows > 0) {
      updates.push(`Fixed ${approvedFixed.affectedRows} APPROVED status(es)`);
    }
    
    // Fix REJECTED
    const rejectedFixed = await query(
      "UPDATE tools SET status = 'REJECTED' WHERE status LIKE 'REJECT%' AND status != 'REJECTED'"
    );
    if (rejectedFixed.affectedRows > 0) {
      updates.push(`Fixed ${rejectedFixed.affectedRows} REJECTED status(es)`);
    }
    
    if (updates.length > 0) {
      console.log('\nUpdates applied:');
      updates.forEach(update => console.log(`  ✓ ${update}`));
    } else {
      console.log('\n✓ No status fixes needed - all statuses are correct!');
    }
    
    // Show final status
    console.log('\nFinal tool statuses:');
    console.log('='.repeat(80));
    const finalTools = await query('SELECT id, name, status FROM tools');
    finalTools.forEach(tool => {
      console.log(`ID: ${tool.id} | Name: ${tool.name} | Status: ${tool.status}`);
    });
    
    console.log('\n✓ Status check and fix complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error checking/fixing status:', error);
    process.exit(1);
  }
}

checkAndFixStatus();
