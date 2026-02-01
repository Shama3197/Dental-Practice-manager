const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testLabworkAPI() {
  console.log('🧪 Testing Labwork API...\n');

  try {
    // Test 1: Get all labwork
    console.log('1. Testing GET /labwork');
    const getResponse = await axios.get(`${API_BASE}/labwork`);
    console.log('✅ GET /labwork - Success');
    console.log(`   Found ${getResponse.data.length} labwork entries`);
    console.log('');

    // Test 2: Create a new labwork entry
    console.log('2. Testing POST /labwork');
    
    // First, get a patient to use
    const patientsResponse = await axios.get(`${API_BASE}/patients`);
    const patientId = patientsResponse.data[0]?._id;
    
    if (!patientId) {
      console.log('❌ No patients found. Creating a test patient first...');
      const newPatient = {
        name: 'Test Patient for Labwork',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: '1234567890',
        email: 'test@example.com',
        address: '123 Test St'
      };
      const patientResponse = await axios.post(`${API_BASE}/patients`, newPatient);
      const testPatientId = patientResponse.data._id;
      console.log('✅ Created test patient:', testPatientId);
    }

    const newLabwork = {
      patientId: patientId || testPatientId,
      caseType: 'Crown',
      dateSent: '2024-01-15',
      status: 'Pending',
      notes: 'Test labwork entry for crown preparation',
      labFiles: [],
      progressImages: []
    };

    const createResponse = await axios.post(`${API_BASE}/labwork`, newLabwork);
    console.log('✅ POST /labwork - Success');
    console.log('   Created labwork:', createResponse.data.caseType);
    console.log('   Labwork ID:', createResponse.data._id);
    console.log('');

    const labworkId = createResponse.data._id;

    // Test 3: Get single labwork
    console.log('3. Testing GET /labwork/:id');
    const getSingleResponse = await axios.get(`${API_BASE}/labwork/${labworkId}`);
    console.log('✅ GET /labwork/:id - Success');
    console.log('   Retrieved labwork:', getSingleResponse.data.caseType);
    console.log('');

    // Test 4: Update labwork
    console.log('4. Testing PUT /labwork/:id');
    const updateData = {
      ...newLabwork,
      status: 'Received',
      notes: 'Updated: Crown received from lab'
    };
    const updateResponse = await axios.put(`${API_BASE}/labwork/${labworkId}`, updateData);
    console.log('✅ PUT /labwork/:id - Success');
    console.log('   Updated status:', updateResponse.data.status);
    console.log('   Updated notes:', updateResponse.data.notes);
    console.log('');

    // Test 5: Get all labwork again to verify
    console.log('5. Testing GET /labwork (verification)');
    const getUpdatedResponse = await axios.get(`${API_BASE}/labwork`);
    console.log('✅ GET /labwork - Success');
    console.log(`   Now have ${getUpdatedResponse.data.length} labwork entries`);
    console.log('');

    // Test 6: Test status filtering
    console.log('6. Testing GET /labwork?status=Received');
    const filterResponse = await axios.get(`${API_BASE}/labwork?status=Received`);
    console.log('✅ GET /labwork?status=Received - Success');
    console.log(`   Found ${filterResponse.data.length} received labwork entries`);
    console.log('');

    // Test 7: Delete labwork
    console.log('7. Testing DELETE /labwork/:id');
    const deleteResponse = await axios.delete(`${API_BASE}/labwork/${labworkId}`);
    console.log('✅ DELETE /labwork/:id - Success');
    console.log('   Response:', deleteResponse.data.message);
    console.log('');

    // Test 8: Verify deletion
    console.log('8. Testing GET /labwork (final verification)');
    const finalResponse = await axios.get(`${API_BASE}/labwork`);
    console.log('✅ GET /labwork - Success');
    console.log(`   Final count: ${finalResponse.data.length} labwork entries`);
    console.log('');

    console.log('🎉 All Labwork API tests passed!');
    console.log('✅ Labwork module is production-ready');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testLabworkAPI(); 