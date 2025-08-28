const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000'; // Adjust port if different
const TEST_DEPARTMENT = {
    name: 'Test Department for API Testing',
    phoneNumbers: ['123456789', '987654321'],
    allowContact: true,
    contactPeriods: 'Monday to Friday 9AM-5PM'
};

const UPDATED_DEPARTMENT = {
    name: 'Updated Test Department',
    phoneNumbers: ['111222333'],
    allowContact: false,
    contactPeriods: 'Updated contact periods: 24/7 support'
};

// You'll need to replace these with actual valid tokens
const AUTH_TOKEN = 'your-auth-token-here';
const ADMIN_TOKEN = 'your-admin-token-here';

async function testEditDepartment() {
    try {
        console.log('🧪 Testing POST /editDepartment/:id endpoint...\n');

        // Step 1: Create a test department first
        console.log('1️⃣ Creating a test department...');
        const createResponse = await axios.post(
            `${BASE_URL}/addDepartment`,
            TEST_DEPARTMENT,
            {
                headers: {
                    'x-auth-token': ADMIN_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!createResponse.data.success) {
            console.error('❌ Failed to create test department:', createResponse.data);
            return null;
        }

        const departmentId = createResponse.data.data._id;
        console.log('✅ Test department created with ID:', departmentId);

        // Step 2: Test editing the department
        console.log('\n2️⃣ Testing EDIT endpoint...');
        const editResponse = await axios.post(
            `${BASE_URL}/editDepartment/${departmentId}`,
            UPDATED_DEPARTMENT,
            {
                headers: {
                    'x-auth-token': ADMIN_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ EDIT request completed successfully!');
        console.log('Response status:', editResponse.status);
        console.log('Response data:', JSON.stringify(editResponse.data, null, 2));

        return departmentId; // Return for use in delete test

    } catch (error) {
        console.error('❌ Edit test failed with error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        return null;
    }
}

async function testDeleteDepartment(departmentId = null) {
    try {
        console.log('\n🧪 Testing DELETE /deleteDepartment/:id endpoint...\n');

        let testDepartmentId = departmentId;

        // If no department ID provided, create a new one
        if (!testDepartmentId) {
            console.log('1️⃣ Creating a test department for deletion...');
            const createResponse = await axios.post(
                `${BASE_URL}/addDepartment`,
                {
                    ...TEST_DEPARTMENT,
                    name: 'Test Department for Deletion',
                    contactPeriods: 'Test contact periods for deletion'
                },
                {
                    headers: {
                        'x-auth-token': ADMIN_TOKEN,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!createResponse.data.success) {
                console.error('❌ Failed to create test department:', createResponse.data);
                return;
            }

            testDepartmentId = createResponse.data.data._id;
            console.log('✅ Test department created with ID:', testDepartmentId);
        }

        // Step 2: Test deleting the department
        console.log('\n2️⃣ Testing DELETE endpoint...');
        const deleteResponse = await axios.delete(
            `${BASE_URL}/deleteDepartment/${testDepartmentId}`,
            {
                headers: {
                    'x-auth-token': ADMIN_TOKEN
                }
            }
        );

        console.log('✅ DELETE request completed successfully!');
        console.log('Response status:', deleteResponse.status);
        console.log('Response data:', JSON.stringify(deleteResponse.data, null, 2));

        // Step 3: Verify the department was actually deleted
        console.log('\n3️⃣ Verifying department was deleted...');
        try {
            const verifyResponse = await axios.delete(
                `${BASE_URL}/deleteDepartment/${testDepartmentId}`,
                {
                    headers: {
                        'x-auth-token': ADMIN_TOKEN
                    }
                }
            );
            console.log('⚠️ Unexpected: Department still exists or endpoint returned success');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ Verification passed: Department was successfully deleted');
            } else {
                console.log('❓ Unexpected error during verification:', error.response?.data || error.message);
            }
        }

    } catch (error) {
        console.error('❌ Delete test failed with error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Test with invalid ID
async function testInvalidOperations() {
    try {
        console.log('\n🧪 Testing operations with invalid IDs...\n');

        const invalidId = '507f1f77bcf86cd799439011'; // Valid ObjectId format but non-existent

        // Test edit with invalid ID
        console.log('1️⃣ Testing EDIT with invalid ID...');
        try {
            await axios.post(
                `${BASE_URL}/editDepartment/${invalidId}`,
                UPDATED_DEPARTMENT,
                {
                    headers: {
                        'x-auth-token': ADMIN_TOKEN,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ EDIT correctly returned 404 for non-existent department');
            } else {
                console.error('❌ Unexpected error:', error.response?.data || error.message);
            }
        }

        // Test delete with invalid ID
        console.log('\n2️⃣ Testing DELETE with invalid ID...');
        try {
            await axios.delete(
                `${BASE_URL}/deleteDepartment/${invalidId}`,
                {
                    headers: {
                        'x-auth-token': ADMIN_TOKEN
                    }
                }
            );
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ DELETE correctly returned 404 for non-existent department');
            } else {
                console.error('❌ Unexpected error:', error.response?.data || error.message);
            }
        }

    } catch (error) {
        console.error('❌ Invalid operations test failed:', error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting Departments endpoints tests...\n');
    console.log('⚠️  Make sure to:');
    console.log('   - Update BASE_URL if your server runs on a different port');
    console.log('   - Replace AUTH_TOKEN and ADMIN_TOKEN with valid tokens');
    console.log('   - Ensure your server is running\n');

    // Test edit endpoint and get department ID for delete test
    const departmentId = await testEditDepartment();

    // Test delete endpoint (reuse the department from edit test if available)
    await testDeleteDepartment(departmentId);

    // Test invalid operations
    await testInvalidOperations();

    console.log('\n🎉 All tests completed!');
}

runTests();
