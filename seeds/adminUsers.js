const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const { User } = require('../models/user');

// Admin users seed data
const adminUsers = [
    {
        name: "أحمد محمد الإداري",
        email: "admin@test.com",
        password: "password123",
        isAdmin: true,
        isActive: true
    },
    {
        name: "فاطمة علي المدير",
        email: "admin2@test.com", 
        password: "password123",
        isAdmin: true,
        isActive: true
    },
    {
        name: "محمد سامر الرئيس",
        email: "admin3@test.com",
        password: "password123", 
        isAdmin: true,
        isActive: true
    },
    {
        name: "نور الدين المشرف",
        email: "supervisor@test.com",
        password: "password123",
        isAdmin: true,
        isActive: true
    },
    {
        name: "ليلى أحمد المسؤول",
        email: "manager@test.com",
        password: "password123",
        isAdmin: true,
        isActive: true
    }
];

// Regular users for testing (non-admin)
const regularUsers = [
    {
        name: "سارة محمد المستخدم",
        email: "user1@test.com",
        password: "password123",
        isAdmin: false,
        isActive: true
    },
    {
        name: "خالد أحمد الموظف",
        email: "user2@test.com",
        password: "password123",
        isAdmin: false,
        isActive: true
    },
    {
        name: "مريم علي الطبيبة",
        email: "doctor@test.com",
        password: "password123",
        isAdmin: false,
        isActive: true
    }
];

async function seedAdminUsers() {
    try {
        // Connect to MongoDB
        const db = config.get('db');
        console.log(`🔗 Connecting to database: ${db}`);
        await mongoose.connect(db);
        console.log('✅ Connected to MongoDB successfully');

        console.log('\n🌱 Starting admin users seeding process...\n');

        let createdCount = 0;
        let skippedCount = 0;

        // Seed admin users
        console.log('👑 Seeding Admin Users:');
        console.log('========================');
        
        for (const userData of adminUsers) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: userData.email });
                
                if (existingUser) {
                    console.log(`⚠️  Admin user already exists: ${userData.email} (${userData.name})`);
                    skippedCount++;
                    continue;
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                // Create new user
                const user = new User({
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    isAdmin: userData.isAdmin,
                    isActive: userData.isActive
                });

                await user.save();
                console.log(`✅ Created admin user: ${userData.email} (${userData.name})`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Error creating admin user ${userData.email}:`, error.message);
            }
        }

        // Seed regular users
        console.log('\n👤 Seeding Regular Users:');
        console.log('==========================');
        
        for (const userData of regularUsers) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: userData.email });
                
                if (existingUser) {
                    console.log(`⚠️  Regular user already exists: ${userData.email} (${userData.name})`);
                    skippedCount++;
                    continue;
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                // Create new user
                const user = new User({
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    isAdmin: userData.isAdmin,
                    isActive: userData.isActive
                });

                await user.save();
                console.log(`✅ Created regular user: ${userData.email} (${userData.name})`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Error creating regular user ${userData.email}:`, error.message);
            }
        }

        // Summary
        console.log('\n📊 Seeding Summary:');
        console.log('===================');
        console.log(`✅ Users created: ${createdCount}`);
        console.log(`⚠️  Users skipped (already exist): ${skippedCount}`);
        console.log(`📝 Total users processed: ${createdCount + skippedCount}`);

        // Display login credentials
        console.log('\n🔑 Login Credentials for Testing:');
        console.log('==================================');
        console.log('Admin Users (can send broadcasts):');
        adminUsers.forEach(user => {
            console.log(`   📧 Email: ${user.email} | 🔒 Password: ${user.password} | 👑 Role: Admin`);
        });
        
        console.log('\nRegular Users (can receive broadcasts):');
        regularUsers.forEach(user => {
            console.log(`   📧 Email: ${user.email} | 🔒 Password: ${user.password} | 👤 Role: User`);
        });

        console.log('\n🎯 Next Steps:');
        console.log('==============');
        console.log('1. Start the backend server: npm start');
        console.log('2. Start the frontend server: ng serve');
        console.log('3. Navigate to: http://localhost:4200');
        console.log('4. Login with any admin credentials above');
        console.log('5. Test broadcast messaging on the dashboard');

        console.log('\n🚀 Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error during seeding process:', error);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the seeding function
if (require.main === module) {
    seedAdminUsers();
}

module.exports = { seedAdminUsers, adminUsers, regularUsers };
