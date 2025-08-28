const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000'; // Adjust port if different
const TEST_QUESTION = {
    question: 'Test question for deletion',
    answer: 'Test answer for deletion'
};

// You'll need to replace these with actual valid tokens
const AUTH_TOKEN = 'your-auth-token-here';
const ADMIN_TOKEN = 'your-admin-token-here';

async function testDeleteQuestion() {
    try {
        console.log('🧪 Testing DELETE /deleteQuestion/:id endpoint...\n');

        // Step 1: Create a test question first
        console.log('1️⃣ Creating a test question...');
        const createResponse = await axios.post(
            `${BASE_URL}/addQuestion`,
            TEST_QUESTION,
            {
                headers: {
                    'x-auth-token': ADMIN_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!createResponse.data.success) {
            console.error('❌ Failed to create test question:', createResponse.data);
            return;
        }

        const questionId = createResponse.data.data._id;
        console.log('✅ Test question created with ID:', questionId);

        // Step 2: Test deleting the question
        console.log('\n2️⃣ Testing DELETE endpoint...');
        const deleteResponse = await axios.delete(
            `${BASE_URL}/deleteQuestion/${questionId}`,
            {
                headers: {
                    'x-auth-token': ADMIN_TOKEN
                }
            }
        );

        console.log('✅ DELETE request completed successfully!');
        console.log('Response status:', deleteResponse.status);
        console.log('Response data:', JSON.stringify(deleteResponse.data, null, 2));

        // Step 3: Verify the question was actually deleted
        console.log('\n3️⃣ Verifying question was deleted...');
        try {
            const verifyResponse = await axios.delete(
                `${BASE_URL}/deleteQuestion/${questionId}`,
                {
                    headers: {
                        'x-auth-token': ADMIN_TOKEN
                    }
                }
            );
            console.log('⚠️ Unexpected: Question still exists or endpoint returned success');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ Verification passed: Question was successfully deleted');
            } else {
                console.log('❓ Unexpected error during verification:', error.response?.data || error.message);
            }
        }

        console.log('\n🎉 Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed with error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Test with invalid ID
async function testDeleteInvalidQuestion() {
    try {
        console.log('\n🧪 Testing DELETE with invalid ID...');
        
        const invalidId = '507f1f77bcf86cd799439011'; // Valid ObjectId format but non-existent
        const deleteResponse = await axios.delete(
            `${BASE_URL}/deleteQuestion/${invalidId}`,
            {
                headers: {
                    'x-auth-token': ADMIN_TOKEN
                }
            }
        );
        
        console.log('Response:', deleteResponse.data);
        
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('✅ Correctly returned 404 for non-existent question');
        } else {
            console.error('❌ Unexpected error:', error.response?.data || error.message);
        }
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting DELETE endpoint tests...\n');
    console.log('⚠️  Make sure to:');
    console.log('   - Update BASE_URL if your server runs on a different port');
    console.log('   - Replace AUTH_TOKEN and ADMIN_TOKEN with valid tokens');
    console.log('   - Ensure your server is running\n');
    
    await testDeleteQuestion();
    await testDeleteInvalidQuestion();
}

runTests();
