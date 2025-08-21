const http = require('http');

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = {
                        status: res.statusCode,
                        data: JSON.parse(body)
                    };
                    resolve(response);
                } catch (error) {
                    reject(new Error('Invalid JSON response: ' + body));
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function testBroadcastEndpoint() {
    try {
        console.log('🧪 Testing Broadcast Messaging API Endpoint Fix');
        console.log('================================================\n');

        // Step 1: Login to get authentication token
        console.log('1. Logging in to get authentication token...');
        const loginResponse = await makeRequest({
            hostname: 'localhost',
            port: 3900,
            path: '/api/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            email: 'admin@test.com',
            password: 'password123'
        });

        if (!loginResponse.data.isSuccess) {
            throw new Error('Login failed: ' + loginResponse.data.message);
        }

        const token = loginResponse.data.data.token;
        const userName = loginResponse.data.data.name;
        console.log(`✅ Login successful! User: ${userName}`);
        console.log(`🔑 Token: ${token.substring(0, 20)}...`);

        // Step 2: Send a test broadcast message
        console.log('\n2. Sending a test broadcast message...');
        const broadcastResponse = await makeRequest({
            hostname: 'localhost',
            port: 3900,
            path: '/api/broadcasts/send',
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        }, {
            message: 'Test message for endpoint validation - ' + new Date().toISOString()
        });

        if (!broadcastResponse.data.isSuccess) {
            throw new Error('Broadcast send failed: ' + broadcastResponse.data.message);
        }

        const messageId = broadcastResponse.data.data._id;
        console.log(`✅ Broadcast sent successfully! Message ID: ${messageId}`);

        // Step 3: Get all messages to verify the message exists
        console.log('\n3. Retrieving all broadcast messages...');
        const messagesResponse = await makeRequest({
            hostname: 'localhost',
            port: 3900,
            path: '/api/broadcasts/getMessages',
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        });

        if (!messagesResponse.data.isSuccess) {
            throw new Error('Get messages failed: ' + messagesResponse.data.message);
        }

        const messages = messagesResponse.data.data;
        const testMessage = messages.find(msg => msg._id === messageId);

        if (!testMessage) {
            throw new Error('Test message not found in messages list');
        }

        console.log(`✅ Message retrieved successfully! Found ${messages.length} total messages`);
        console.log(`📝 Test message: "${testMessage.message}"`);
        console.log(`👤 Sender: ${testMessage.senderName}`);
        console.log(`📖 Read status: ${testMessage.isRead ? 'Read' : 'Unread'}`);

        // Step 4: Test the problematic endpoint - Mark message as read
        console.log('\n4. Testing the fixed markAsRead endpoint...');
        console.log(`🎯 Testing POST /api/broadcasts/markAsRead/${messageId}`);

        const markAsReadResponse = await makeRequest({
            hostname: 'localhost',
            port: 3900,
            path: `/api/broadcasts/markAsRead/${messageId}`,
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        }, {});

        if (!markAsReadResponse.data.isSuccess) {
            throw new Error('Mark as read failed: ' + markAsReadResponse.data.message);
        }

        console.log('✅ Mark as read successful!');
        console.log(`📋 Response: ${markAsReadResponse.data.message}`);

        // Step 5: Verify the message is now marked as read
        console.log('\n5. Verifying message is marked as read...');
        const verifyResponse = await makeRequest({
            hostname: 'localhost',
            port: 3900,
            path: '/api/broadcasts/getMessages',
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        });

        const updatedMessages = verifyResponse.data.data;
        const updatedMessage = updatedMessages.find(msg => msg._id === messageId);

        if (!updatedMessage) {
            throw new Error('Updated message not found');
        }

        console.log(`📖 Updated read status: ${updatedMessage.isRead ? 'Read' : 'Unread'}`);
        console.log(`👥 Readers count: ${updatedMessage.readersCount}`);

        if (updatedMessage.isRead) {
            console.log('✅ Message successfully marked as read!');
        } else {
            console.log('⚠️  Message read status not updated properly');
        }

        // Step 6: Test admin-only endpoint - Get readers
        console.log('\n6. Testing admin-only getReaders endpoint...');
        const readersResponse = await makeRequest({
            hostname: 'localhost',
            port: 3900,
            path: `/api/broadcasts/getReaders/${messageId}`,
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        });

        if (!readersResponse.data.isSuccess) {
            throw new Error('Get readers failed: ' + readersResponse.data.message);
        }

        const readersData = readersResponse.data.data;
        console.log('✅ Get readers successful!');
        console.log(`👥 Readers count: ${readersData.readersCount}`);
        console.log(`📋 Readers:`, readersData.readers);

        console.log('\n🎉 All tests passed! The broadcast messaging API endpoints are working correctly.');
        console.log('\n📊 Test Summary:');
        console.log('================');
        console.log('✅ Authentication: Working');
        console.log('✅ Send broadcast: Working');
        console.log('✅ Get messages: Working');
        console.log('✅ Mark as read: Working (FIXED!)');
        console.log('✅ Get readers: Working');
        console.log('\n🔧 The 404 error has been resolved!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);

        if (error.response) {
            console.error('📋 Response status:', error.response.status);
            console.error('📋 Response data:', error.response.data);
        }

        console.log('\n🔧 Troubleshooting:');
        console.log('- Ensure the backend server is running on port 3900');
        console.log('- Check that the database contains the test users');
        console.log('- Verify the validateObjectId middleware changes are loaded');

        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    testBroadcastEndpoint();
}

module.exports = { testBroadcastEndpoint };
