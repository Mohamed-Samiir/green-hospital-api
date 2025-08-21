# 🌱 Database Seeding Guide - Shifa Healthcare System

## Quick Start

### 1. Run the Seeds
```bash
# Navigate to the backend directory
cd D:\Work\shefa-api

# Run all database seeds
npm run seed
```

### 2. Start the Servers
```bash
# Backend (in shefa-api directory)
npm start

# Frontend (in Shifa Customer Support directory)
cd "D:\Work\Shifa Customer Support"
ng serve
```

### 3. Test the Broadcast Messaging System
1. Open browser: http://localhost:4200
2. Login with admin credentials: `admin@test.com` / `password123`
3. Navigate to dashboard to see the broadcast messaging panel
4. Send test broadcast messages
5. Open another browser window and login with `user1@test.com` / `password123`
6. See real-time message delivery and test marking messages as read

## 🔑 Test Credentials

### Admin Users (Can Send Broadcasts)
| Email | Password | Name | Role |
|-------|----------|------|------|
| admin@test.com | password123 | أحمد محمد الإداري | Admin |
| admin2@test.com | password123 | فاطمة علي المدير | Admin |
| admin3@test.com | password123 | محمد سامر الرئيس | Admin |
| supervisor@test.com | password123 | نور الدين المشرف | Admin |
| manager@test.com | password123 | ليلى أحمد المسؤول | Admin |

### Regular Users (Receive Broadcasts)
| Email | Password | Name | Role |
|-------|----------|------|------|
| user1@test.com | password123 | سارة محمد المستخدم | User |
| user2@test.com | password123 | خالد أحمد الموظف | User |
| doctor@test.com | password123 | مريم علي الطبيبة | User |

## 🧪 Testing Scenarios

### Scenario 1: Admin Broadcasting
1. Login as admin (`admin@test.com`)
2. Go to dashboard
3. Use the broadcast panel on the left side
4. Type a message and click "إرسال" (Send)
5. Message should appear immediately in the panel

### Scenario 2: Real-time Message Delivery
1. Keep admin session open
2. Open new browser window/tab
3. Login as regular user (`user1@test.com`)
4. Go to dashboard
5. Send broadcast from admin window
6. Message should appear instantly in user window

### Scenario 3: Message Read Tracking
1. As regular user, click "تحديد كمقروءة" (Mark as Read)
2. Message should change appearance (read vs unread styling)
3. As admin, click "عرض القراء" (View Readers) on the message
4. Should see the user who marked it as read

### Scenario 4: Multi-Admin Testing
1. Login with different admin accounts in separate windows
2. Send messages from different admins
3. Verify sender names appear correctly
4. Test admin-only features (clear history, view readers)

## 🔧 Troubleshooting

### "Connection refused" Error
```bash
# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"

# If not running, start MongoDB service
# Windows: Start MongoDB service from Services
# macOS/Linux: mongod
```

### "Users already exist" Messages
This is normal - the seed script skips existing users. To recreate users:
```bash
# Delete existing test users
mongo shifa-db --eval "db.users.deleteMany({email: /test.com/})"

# Run seeds again
npm run seed
```

### Backend Server Not Starting
```bash
# Check if port 3900 is in use
netstat -an | findstr :3900

# Install dependencies if needed
npm install

# Check configuration
cat config/default.json
```

### Frontend Server Issues
```bash
# Navigate to frontend directory
cd "D:\Work\Shifa Customer Support"

# Install dependencies
npm install

# Start development server
ng serve
```

## 📊 Verification Commands

### Check Created Users
```bash
# View all seeded users
mongo shifa-db --eval "db.users.find({email: /test.com/}, {name: 1, email: 1, isAdmin: 1}).pretty()"

# Count admin users
mongo shifa-db --eval "db.users.countDocuments({isAdmin: true, email: /test.com/})"

# Count regular users  
mongo shifa-db --eval "db.users.countDocuments({isAdmin: false, email: /test.com/})"
```

### Test API Endpoints
```bash
# Test authentication (should return user data)
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' \
  http://localhost:3900/api/auth

# Test broadcast endpoint (should require authentication)
curl http://localhost:3900/api/broadcasts/getMessages
```

## 🎯 Next Steps

After successful seeding and testing:

1. **Development**: Use these accounts for ongoing development and testing
2. **Feature Testing**: Test all broadcast messaging features thoroughly
3. **Multi-user Testing**: Use multiple browser windows to simulate real-world usage
4. **Performance Testing**: Send multiple messages and test with many users
5. **Production Preparation**: Never use these test credentials in production

## 📝 Additional Commands

### Show Help
```bash
node seed.js --help
```

### Run Specific Seed
```bash
node seeds/adminUsers.js
```

### Clean Database (Careful!)
```bash
# Remove all test users
mongo shifa-db --eval "db.users.deleteMany({email: /test.com/})"

# Remove all broadcast messages
mongo shifa-db --eval "db.broadcastmessages.deleteMany({})"
```

## 🔐 Security Notes

- **Test Environment Only**: These credentials are for development/testing
- **Weak Passwords**: All users use "password123" for easy testing
- **Production Warning**: Never use these credentials in production
- **Password Hashing**: All passwords are properly hashed with bcrypt

---

**Happy Testing! 🚀**

For more information, see the detailed documentation in `seeds/README.md`.
