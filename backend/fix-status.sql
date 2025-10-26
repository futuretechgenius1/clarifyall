-- Check current status values in the database
SELECT id, name, status, LENGTH(status) as status_length FROM tools;

-- If status is truncated, update it to the correct value
UPDATE tools SET status = 'PENDING_APPROVAL' WHERE status LIKE 'PENDING_APPROVA%';
UPDATE tools SET status = 'APPROVED' WHERE status LIKE 'APPROVE%' AND status != 'APPROVED';
UPDATE tools SET status = 'REJECTED' WHERE status LIKE 'REJECT%' AND status != 'REJECTED';

-- Verify the fix
SELECT id, name, status FROM tools;
