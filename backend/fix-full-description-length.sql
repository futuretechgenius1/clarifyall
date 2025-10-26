-- Fix full_description column to support unlimited text length
-- This changes the column from VARCHAR to LONGTEXT to prevent truncation

USE clarifyall_db;

-- Change full_description column to LONGTEXT to support very long descriptions
ALTER TABLE tools MODIFY COLUMN full_description LONGTEXT;

-- Verify the change
DESCRIBE tools;

-- Note: LONGTEXT can store up to 4GB of text data
-- This ensures no truncation of tool descriptions regardless of length
