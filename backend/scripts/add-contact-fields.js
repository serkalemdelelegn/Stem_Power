/**
 * Script to add new fields to contact_offices table
 * Run this if the database columns don't exist yet
 * 
 * Usage: node backend/scripts/add-contact-fields.js
 */

const sequelize = require('../config/db');

async function addContactFields() {
  try {
    console.log('Adding new fields to contact_offices table...');
    
    // Check which columns exist
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'contact_offices'
    `);
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', existingColumns);
    
    // Add map_link column if it doesn't exist
    if (!existingColumns.includes('map_link')) {
      await sequelize.query(`
        ALTER TABLE contact_offices 
        ADD COLUMN map_link TEXT NULL
      `);
      console.log('✅ Added map_link column');
    } else {
      console.log('⚠️  map_link column already exists');
    }
    
    // Add website column if it doesn't exist
    if (!existingColumns.includes('website')) {
      await sequelize.query(`
        ALTER TABLE contact_offices 
        ADD COLUMN website VARCHAR(500) NULL
      `);
      console.log('✅ Added website column');
    } else {
      console.log('⚠️  website column already exists');
    }
    
    // Add office_hours column if it doesn't exist
    if (!existingColumns.includes('office_hours')) {
      await sequelize.query(`
        ALTER TABLE contact_offices 
        ADD COLUMN office_hours VARCHAR(200) NULL
      `);
      console.log('✅ Added office_hours column');
    } else {
      console.log('⚠️  office_hours column already exists');
    }
    
    // Add mobile column if it doesn't exist
    if (!existingColumns.includes('mobile')) {
      await sequelize.query(`
        ALTER TABLE contact_offices 
        ADD COLUMN mobile VARCHAR(50) NULL
      `);
      console.log('✅ Added mobile column');
    } else {
      console.log('⚠️  mobile column already exists');
    }
    
    console.log('✅ All columns checked/added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
    // If column already exists, that's okay
    if (error.message.includes('Duplicate column name') || error.message.includes('already exists')) {
      console.log('⚠️  Some columns may already exist. This is okay.');
      process.exit(0);
    }
    process.exit(1);
  }
}

addContactFields();

