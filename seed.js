#!/usr/bin/env node

/**
 * Shifa Healthcare System - Database Seeding Script
 *
 * This script seeds the local MongoDB database with test data for development and testing.
 * It creates admin users for testing the broadcast messaging system and other features.
 *
 * Usage:
 *   npm run seed              - Run all seeds
 *   node seed.js              - Direct execution
 *   node seed.js --help       - Show help information
 *
 * Environment:
 *   - Targets local MongoDB: mongodb://localhost:27017/shifa-db
 *   - Creates admin and regular users with hashed passwords
 *   - Prevents duplicate user creation
 */

const { seedAdminUsers } = require('./seeds/adminUsers');

// Parse command line arguments
const args = process.argv.slice(2);

function showHelp() {
  console.log(`
🏥 Shifa Healthcare System - Database Seeding Script
====================================================

This script populates the local MongoDB database with test users for development and testing.

Usage:
  npm run seed              Run all database seeds
  node seed.js              Direct script execution
  node seed.js --help       Show this help message

What gets seeded:
  👑 Admin Users (5)        Users with broadcast messaging privileges
  👤 Regular Users (3)      Standard users for testing

Database Target:
  📍 Local MongoDB: mongodb://localhost:27017/shifa-db

Features:
  ✅ Password hashing with bcrypt
  ✅ Duplicate prevention (skips existing users)
  ✅ Comprehensive error handling
  ✅ Detailed console output with emojis
  ✅ Login credentials display for testing

Test Credentials (after seeding):
  📧 admin@test.com     🔒 password123  👑 Admin
  📧 admin2@test.com    🔒 password123  👑 Admin
  📧 admin3@test.com    🔒 password123  👑 Admin
  📧 user1@test.com     🔒 password123  👤 User
  📧 doctor@test.com    🔒 password123  👤 User

Next Steps After Seeding:
  1. Start backend:  npm start
  2. Start frontend: ng serve
  3. Open browser:   http://localhost:4200
  4. Login with admin credentials
  5. Test broadcast messaging on dashboard

For more information, visit: https://github.com/Mohamed-Samiir/green-hospital-api
`);
}

async function runAllSeeds() {
  console.log(`
🏥 Shifa Healthcare System - Database Seeding
==============================================
`);

  try {
    // Run admin users seed
    await seedAdminUsers();

    console.log('\n🎉 All seeding operations completed successfully!');
    console.log('\n💡 Tip: Use the displayed credentials to login and test the broadcast messaging system.');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Ensure MongoDB is running on localhost:27017');
    console.error('   2. Check database connection in config/default.json');
    console.error('   3. Verify all dependencies are installed: npm install');
    console.error('   4. Check for any network or permission issues');
    process.exit(1);
  }
}

// Handle command line arguments
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Run the seeding process
if (require.main === module) {
  runAllSeeds();
}

module.exports = { runAllSeeds };
