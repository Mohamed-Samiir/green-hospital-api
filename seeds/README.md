# Shifa Healthcare System - Database Seeds

This directory contains database seeding scripts for the Shifa Healthcare System. These scripts populate the local MongoDB database with test data for development and testing purposes.

## 🎯 Purpose

The seed scripts are designed to:
- Create admin users for testing the broadcast messaging system
- Provide regular users for comprehensive testing scenarios
- Enable quick setup of a development environment
- Support testing of user authentication and authorization features

## 📁 Files

### `adminUsers.js`
Main seeding script that creates:
- **5 Admin Users**: Users with `isAdmin: true` for testing broadcast messaging
- **3 Regular Users**: Standard users with `isAdmin: false` for testing message reception

### Features:
- ✅ **Password Hashing**: Uses bcrypt with salt rounds (10) for secure password storage
- ✅ **Duplicate Prevention**: Checks for existing users before creation
- ✅ **Schema Compliance**: Follows the exact User model schema requirements
- ✅ **Error Handling**: Comprehensive error handling with detailed logging
- ✅ **Arabic Names**: Uses Arabic names for realistic testing scenarios

## 🚀 Usage

### Run All Seeds
```bash
# Using npm script (recommended)
npm run seed

# Direct execution
node seed.js

# Show help information
node seed.js --help
```

### Run Specific Seed
```bash
# Run only admin users seed
node seeds/adminUsers.js
```

## 👥 Test Users Created

### Admin Users (Broadcast Messaging Privileges)
| Name | Email | Password | Role | Status |
|------|-------|----------|------|--------|
| أحمد محمد الإداري | admin@test.com | password123 | Admin | Active |
| فاطمة علي المدير | admin2@test.com | password123 | Admin | Active |
| محمد سامر الرئيس | admin3@test.com | password123 | Admin | Active |
| نور الدين المشرف | supervisor@test.com | password123 | Admin | Active |
| ليلى أحمد المسؤول | manager@test.com | password123 | Admin | Active |

### Regular Users (Message Recipients)
| Name | Email | Password | Role | Status |
|------|-------|----------|------|--------|
| سارة محمد المستخدم | user1@test.com | password123 | User | Active |
| خالد أحمد الموظف | user2@test.com | password123 | User | Active |
| مريم علي الطبيبة | doctor@test.com | password123 | User | Active |

## 🔧 Prerequisites

### 1. MongoDB Running
Ensure MongoDB is running on your local machine:
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Start MongoDB (if not running)
# Windows: Start MongoDB service
# macOS/Linux: mongod
```

### 2. Dependencies Installed
```bash
npm install
```

### 3. Configuration
Verify database connection in `config/default.json`:
```json
{
  "db": "mongodb://localhost:27017/shifa-db"
}
```

## 🧪 Testing the Broadcast Messaging System

After running the seeds:

### 1. Start the Servers
```bash
# Backend (in shefa-api directory)
npm start

# Frontend (in Shifa Customer Support directory)
ng serve
```

### 2. Test Admin Broadcasting
1. Navigate to: http://localhost:4200
2. Login with admin credentials (e.g., admin@test.com / password123)
3. Access the dashboard to see the broadcast messaging panel
4. Send test broadcast messages
5. View message readers and manage broadcast history

### 3. Test User Message Reception
1. Open a new browser window/tab (or incognito mode)
2. Login with regular user credentials (e.g., user1@test.com / password123)
3. Navigate to dashboard to see received broadcast messages
4. Mark messages as read and test real-time updates

### 4. Test Multi-User Scenarios
- Login with multiple admin accounts to test sender identification
- Login with multiple regular users to test message delivery
- Test real-time Socket.io communication between users

## 🛠️ Troubleshooting

### Common Issues:

#### "Connection refused" Error
- Ensure MongoDB is running on localhost:27017
- Check firewall settings
- Verify MongoDB service status

#### "User already exists" Messages
- This is normal behavior - seeds skip existing users
- To recreate users, delete them from MongoDB first:
```bash
mongosh shifa-db --eval "db.users.deleteMany({email: /test.com/})"
```

#### "Validation Error"
- Check User model schema in `models/user.js`
- Ensure all required fields are provided
- Verify data types match schema requirements

#### "bcrypt Error"
- Ensure bcrypt is properly installed: `npm install bcrypt`
- Check Node.js version compatibility
- Try rebuilding bcrypt: `npm rebuild bcrypt`

## 📊 Database Schema Compliance

The seeded users comply with the User model schema:

```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, 5-255 chars, unique),
  password: String (required, 5-1024 chars, hashed),
  isAdmin: Boolean,
  isActive: Boolean
}
```

## 🔐 Security Notes

- **Test Environment Only**: These seeds are for development/testing only
- **Weak Passwords**: All users use "password123" for easy testing
- **Production Warning**: Never use these credentials in production
- **Password Hashing**: Passwords are properly hashed with bcrypt + salt

## 📝 Adding New Seeds

To add new seed data:

1. Create a new seed file in the `seeds/` directory
2. Follow the existing pattern with proper error handling
3. Import and call from `seed.js`
4. Update this README with new seed information

Example:
```javascript
// seeds/newSeed.js
const { Model } = require('../models/model');

async function seedNewData() {
    // Seeding logic here
}

module.exports = { seedNewData };
```

## 🤝 Contributing

When contributing new seeds:
- Follow existing naming conventions
- Include comprehensive error handling
- Add detailed console logging
- Update documentation
- Test thoroughly before committing
