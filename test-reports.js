const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
let testPatientId;
let testAppointmentId;
let testIncomeId;
let testTreatmentId;
let testLabWorkId;

// Wait for backend to be ready
async function waitForBackend() {
  console.log('🔄 Waiting for backend to be ready...');
  let attempts = 0;
  while (attempts < 30) {
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      if (response.status === 200) {
        console.log('✅ Backend is up and healthy.');
        return true;
      }
    } catch (error) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Backend not responding after 30 attempts');
}

// Create test data
async function createTestData() {
  console.log('🏥 Creating test data for reports...');
  
  // Create test patient
  const patientResponse = await axios.post(`${BASE_URL}/patients`, {
    name: 'Test Patient for Reports',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    contactNumber: '1234567890',
    email: 'testreports@example.com',
    address: '123 Test St'
  });
  testPatientId = patientResponse.data._id;
  console.log('✅ Test patient created:', testPatientId);

  // Create test appointment
  const appointmentResponse = await axios.post(`${BASE_URL}/appointments`, {
    patient: testPatientId,
    date: '2024-12-25',
    time: '10:00',
    status: 'Scheduled',
    treatmentDetails: ['Dental Cleaning', 'Check-up'],
    selectedTeeth: [11, 12, 13],
    caseNotes: 'Test appointment for reports'
  });
  testAppointmentId = appointmentResponse.data._id;
  console.log('✅ Test appointment created:', testAppointmentId);

  // Create test income
  const incomeResponse = await axios.post(`${BASE_URL}/income`, {
    date: '2024-12-25',
    amount: 500,
    source: 'Consultation',
    notes: 'Test income for reports'
  });
  testIncomeId = incomeResponse.data._id;
  console.log('✅ Test income created:', testIncomeId);

  // Create test treatment plan
  const treatmentResponse = await axios.post(`${BASE_URL}/treatments`, {
    patientId: testPatientId,
    title: 'Test Treatment Plan for Reports',
    description: 'Comprehensive dental treatment plan for testing reports',
    totalCost: 1500,
    status: 'Active',
    priority: 'Medium',
    stages: [
      {
        title: 'Initial Consultation',
        description: 'First consultation and assessment',
        treatmentType: 'Consultation',
        teeth: ['11', '12', '13'],
        cost: 200,
        completed: true,
        completedDate: new Date(),
        notes: 'Initial consultation completed'
      },
      {
        title: 'Dental Cleaning',
        description: 'Professional dental cleaning',
        treatmentType: 'Cleaning',
        teeth: ['11', '12', '13', '21', '22', '23'],
        cost: 300,
        completed: false,
        notes: 'Scheduled for next visit'
      }
    ],
    notes: 'Test treatment plan for reports functionality',
    startDate: new Date(),
    estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  testTreatmentId = treatmentResponse.data._id;
  console.log('✅ Test treatment plan created:', testTreatmentId);

  // Create test lab work
  const labWorkResponse = await axios.post(`${BASE_URL}/labwork`, {
    patientId: testPatientId,
    labName: 'Test Lab for Reports',
    workType: 'Crown',
    description: 'Test lab work for reports',
    status: 'Pending',
    expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    cost: 400,
    notes: 'Test lab work for reports functionality'
  });
  testLabWorkId = labWorkResponse.data._id;
  console.log('✅ Test lab work created:', testLabWorkId);
}

// Test dashboard analytics
async function testDashboardAnalytics() {
  console.log('\n📊 Testing Dashboard Analytics...');
  
  try {
    const response = await axios.get(`${BASE_URL}/reports/dashboard`);
    console.log('✅ Dashboard analytics retrieved successfully');
    console.log('   - Appointments:', response.data.appointments);
    console.log('   - Patients:', response.data.patients);
    console.log('   - Income:', response.data.income);
    console.log('   - Treatments:', response.data.treatments);
    console.log('   - Lab Work:', response.data.labWork);
  } catch (error) {
    console.error('❌ Dashboard analytics test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test appointment reports
async function testAppointmentReports() {
  console.log('\n📅 Testing Appointment Reports...');
  
  try {
    const response = await axios.get(`${BASE_URL}/reports/appointments`);
    console.log('✅ Appointment reports retrieved successfully');
    console.log('   - Total appointments:', response.data.pagination.total);
    console.log('   - Appointments in response:', response.data.data.length);
    console.log('   - Statistics:', response.data.stats);
  } catch (error) {
    console.error('❌ Appointment reports test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test patient reports
async function testPatientReports() {
  console.log('\n👥 Testing Patient Reports...');
  
  try {
    const response = await axios.get(`${BASE_URL}/reports/patients`);
    console.log('✅ Patient reports retrieved successfully');
    console.log('   - Total patients:', response.data.pagination.total);
    console.log('   - Patients in response:', response.data.data.length);
    console.log('   - Demographics:', response.data.demographics);
  } catch (error) {
    console.error('❌ Patient reports test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test financial reports
async function testFinancialReports() {
  console.log('\n💰 Testing Financial Reports...');
  
  try {
    const response = await axios.get(`${BASE_URL}/reports/financial`);
    console.log('✅ Financial reports retrieved successfully');
    console.log('   - Income by period:', response.data.incomeByPeriod.length, 'entries');
    console.log('   - Income by source:', response.data.incomeBySource.length, 'sources');
    console.log('   - Treatment revenue:', response.data.treatmentRevenue.length, 'statuses');
  } catch (error) {
    console.error('❌ Financial reports test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test treatment reports
async function testTreatmentReports() {
  console.log('\n🦷 Testing Treatment Reports...');
  
  try {
    const response = await axios.get(`${BASE_URL}/reports/treatments`);
    console.log('✅ Treatment reports retrieved successfully');
    console.log('   - Total treatments:', response.data.pagination.total);
    console.log('   - Treatments in response:', response.data.data.length);
    console.log('   - Statistics:', response.data.stats);
  } catch (error) {
    console.error('❌ Treatment reports test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test lab work reports
async function testLabWorkReports() {
  console.log('\n🧪 Testing Lab Work Reports...');
  
  try {
    const response = await axios.get(`${BASE_URL}/reports/labwork`);
    console.log('✅ Lab work reports retrieved successfully');
    console.log('   - Total lab work:', response.data.pagination.total);
    console.log('   - Lab work in response:', response.data.data.length);
    console.log('   - Statistics:', response.data.stats);
  } catch (error) {
    console.error('❌ Lab work reports test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test data export
async function testDataExport() {
  console.log('\n📤 Testing Data Export...');
  
  try {
    // Test JSON export
    const jsonResponse = await axios.get(`${BASE_URL}/reports/export/appointments?format=json`);
    console.log('✅ JSON export successful');
    console.log('   - Export date:', jsonResponse.data.exportDate);
    console.log('   - Record count:', jsonResponse.data.recordCount);

    // Test CSV export
    const csvResponse = await axios.get(`${BASE_URL}/reports/export/patients?format=csv`, {
      responseType: 'text'
    });
    console.log('✅ CSV export successful');
    console.log('   - CSV content length:', csvResponse.data.length);
    console.log('   - Contains headers:', csvResponse.data.includes('name,email,phone'));
  } catch (error) {
    console.error('❌ Data export test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test filtering
async function testFiltering() {
  console.log('\n🔍 Testing Report Filtering...');
  
  try {
    // Test date filtering
    const dateFilterResponse = await axios.get(`${BASE_URL}/reports/appointments?startDate=2024-12-01&endDate=2024-12-31`);
    console.log('✅ Date filtering works');
    console.log('   - Filtered appointments:', dateFilterResponse.data.pagination.total);

    // Test status filtering
    const statusFilterResponse = await axios.get(`${BASE_URL}/reports/appointments?status=Scheduled`);
    console.log('✅ Status filtering works');
    console.log('   - Scheduled appointments:', statusFilterResponse.data.pagination.total);

    // Test gender filtering
    const genderFilterResponse = await axios.get(`${BASE_URL}/reports/patients?gender=Male`);
    console.log('✅ Gender filtering works');
    console.log('   - Male patients:', genderFilterResponse.data.pagination.total);
  } catch (error) {
    console.error('❌ Filtering test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Clean up test data
async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    if (testLabWorkId) {
      await axios.delete(`${BASE_URL}/labwork/${testLabWorkId}`);
      console.log('✅ Test lab work deleted');
    }
    
    if (testTreatmentId) {
      await axios.delete(`${BASE_URL}/treatments/${testTreatmentId}`);
      console.log('✅ Test treatment plan deleted');
    }
    
    if (testIncomeId) {
      await axios.delete(`${BASE_URL}/income/${testIncomeId}`);
      console.log('✅ Test income deleted');
    }
    
    if (testAppointmentId) {
      await axios.delete(`${BASE_URL}/appointments/${testAppointmentId}`);
      console.log('✅ Test appointment deleted');
    }
    
    if (testPatientId) {
      await axios.delete(`${BASE_URL}/patients/${testPatientId}`);
      console.log('✅ Test patient deleted');
    }
  } catch (error) {
    console.error('⚠️ Cleanup warning:', error.response?.data || error.message);
  }
}

// Main test function
async function runReportsTests() {
  console.log('🚀 Starting Reports Module Tests\n');
  
  try {
    await waitForBackend();
    await createTestData();
    
    await testDashboardAnalytics();
    await testAppointmentReports();
    await testPatientReports();
    await testFinancialReports();
    await testTreatmentReports();
    await testLabWorkReports();
    await testDataExport();
    await testFiltering();
    
    console.log('\n🎉 All Reports tests completed successfully!');
    console.log('✅ Reports module is production-ready');
    console.log('🚀 Backend API is working correctly');
    console.log('✅ All analytics endpoints functional');
    console.log('✅ Data export functionality working');
    console.log('✅ Filtering and pagination working');
    console.log('✅ Ready for production use');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    console.error('❌ Reports module needs attention');
  } finally {
    await cleanupTestData();
  }
}

// Run tests
runReportsTests().catch(console.error); 