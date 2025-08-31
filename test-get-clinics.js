const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000'; // Adjust port if different

// You'll need to replace this with an actual valid token
const AUTH_TOKEN = 'your-auth-token-here';

async function testGetClinics() {
    try {
        console.log('🧪 Testing GET /getClinics endpoint...\n');

        const response = await axios.get(
            `${BASE_URL}/getClinics`,
            {
                headers: {
                    'x-auth-token': AUTH_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ GET request completed successfully!');
        console.log('Response status:', response.status);
        console.log('Response structure validation:\n');

        const data = response.data.data;

        if (!Array.isArray(data)) {
            console.error('❌ Response data is not an array');
            return;
        }

        console.log(`📊 Found ${data.length} clinics`);

        // Validate the structure of each clinic
        data.forEach((clinic, index) => {
            console.log(`\n🏥 Clinic ${index + 1}: ${clinic.clinicName}`);
            
            // Check required fields
            const requiredFields = ['clinicName', '_id', 'doctors'];
            const missingFields = requiredFields.filter(field => !(field in clinic));
            
            if (missingFields.length > 0) {
                console.error(`❌ Missing fields: ${missingFields.join(', ')}`);
            } else {
                console.log('✅ All required clinic fields present');
            }

            // Validate doctors array
            if (!Array.isArray(clinic.doctors)) {
                console.error('❌ doctors is not an array');
                return;
            }

            console.log(`   👨‍⚕️ Has ${clinic.doctors.length} doctors`);

            // Validate each doctor structure
            clinic.doctors.forEach((doctor, doctorIndex) => {
                console.log(`   Doctor ${doctorIndex + 1}: ${doctor.name}`);
                
                const requiredDoctorFields = [
                    'name', 'doctorId', '_id', 'price', 'acceptInsurance', 
                    'freeVisitFollowup', 'ageFrom', 'ageFromUnit', 'ageTo', 
                    'ageToUnit', 'notes', 'branches'
                ];
                
                const missingDoctorFields = requiredDoctorFields.filter(field => !(field in doctor));
                
                if (missingDoctorFields.length > 0) {
                    console.error(`   ❌ Missing doctor fields: ${missingDoctorFields.join(', ')}`);
                } else {
                    console.log('   ✅ All required doctor fields present');
                }

                // Validate branches array
                if (!Array.isArray(doctor.branches)) {
                    console.error('   ❌ branches is not an array');
                } else {
                    console.log(`   🏢 Has ${doctor.branches.length} branches`);
                    
                    // Validate each branch structure
                    doctor.branches.forEach((branch, branchIndex) => {
                        const requiredBranchFields = ['branchName', '_id'];
                        const missingBranchFields = requiredBranchFields.filter(field => !(field in branch));
                        
                        if (missingBranchFields.length > 0) {
                            console.error(`   ❌ Branch ${branchIndex + 1} missing fields: ${missingBranchFields.join(', ')}`);
                        } else {
                            console.log(`   ✅ Branch ${branchIndex + 1}: ${branch.branchName}`);
                        }
                    });
                }
            });
        });

        // Show sample response structure
        if (data.length > 0) {
            console.log('\n📋 Sample Response Structure:');
            console.log(JSON.stringify(data[0], null, 2));
        }

        console.log('\n🎉 Response structure validation completed!');

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

// Test the expected response format
function validateExpectedFormat() {
    console.log('\n📝 Expected Response Format:');
    const expectedFormat = [
        {
            clinicName: "string",
            _id: "string",
            doctors: [
                {
                    name: "string (doctor name from doctor entity)",
                    doctorId: "string (doctor id from doctor entity)",
                    _id: "string (clinicDoctor entity id)",
                    price: "number",
                    acceptInsurance: "boolean",
                    freeVisitFollowup: "boolean",
                    ageFrom: "number",
                    ageFromUnit: "number",
                    ageTo: "number",
                    ageToUnit: "number",
                    notes: "string",
                    branches: [
                        {
                            branchName: "string",
                            _id: "string (branch id from branch entity)"
                        }
                    ]
                }
            ]
        }
    ];
    
    console.log(JSON.stringify(expectedFormat, null, 2));
}

// Run tests
async function runTests() {
    console.log('🚀 Starting getClinics API test...\n');
    console.log('⚠️  Make sure to:');
    console.log('   - Update BASE_URL if your server runs on a different port');
    console.log('   - Replace AUTH_TOKEN with a valid token');
    console.log('   - Ensure your server is running');
    console.log('   - Have some test data in your database\n');
    
    validateExpectedFormat();
    await testGetClinics();
}

runTests();
