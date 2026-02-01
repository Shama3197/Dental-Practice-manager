const API_URL = 'http://localhost:5000/api';

async function testAppointments() {
  console.log('🧪 Testing Appointments Module...\n');

  try {
    // 1. Test GET /api/appointments
    console.log('1. Testing GET /api/appointments...');
    const getResponse = await fetch(`${API_URL}/appointments`);
    const appointments = await getResponse.json();
    console.log('✅ GET /api/appointments:', appointments);
    console.log('Status:', getResponse.status);

    // 2. Test GET /api/patients (to get a patient ID)
    console.log('\n2. Testing GET /api/patients...');
    const patientsResponse = await fetch(`${API_URL}/patients`);
    const patients = await patientsResponse.json();
    console.log('✅ GET /api/patients:', patients);
    console.log('Status:', patientsResponse.status);

    if (patients.length === 0) {
      console.log('⚠️  No patients found. Creating a test patient...');
      
      // Create a test patient
      const patientData = {
        name: "Test Patient",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        contactNumber: "1234567890",
        email: "test@example.com",
        address: "123 Test St"
      };

      const createPatientResponse = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      if (createPatientResponse.ok) {
        const newPatient = await createPatientResponse.json();
        console.log('✅ Created test patient:', newPatient);
        
        // 3. Test POST /api/appointments
        console.log('\n3. Testing POST /api/appointments...');
        const appointmentData = {
          patientId: newPatient._id,
          date: "2024-12-25",
          time: "10:00",
          status: "Scheduled",
          treatmentDetails: ["Dental Cleaning", "Check-up"],
          caseNotes: "Test appointment",
          selectedTeeth: [11, 12, 13]
        };

        const createAppointmentResponse = await fetch(`${API_URL}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData)
        });

        if (createAppointmentResponse.ok) {
          const newAppointment = await createAppointmentResponse.json();
          console.log('✅ Created appointment:', newAppointment);
          console.log('Status:', createAppointmentResponse.status);

          // 4. Test GET /api/appointments/:id
          console.log('\n4. Testing GET /api/appointments/:id...');
          const getAppointmentResponse = await fetch(`${API_URL}/appointments/${newAppointment._id}`);
          const appointment = await getAppointmentResponse.json();
          console.log('✅ GET appointment by ID:', appointment);
          console.log('Status:', getAppointmentResponse.status);

          // 5. Test PUT /api/appointments/:id
          console.log('\n5. Testing PUT /api/appointments/:id...');
          const updateData = {
            ...appointmentData,
            status: "Completed",
            caseNotes: "Updated test appointment"
          };

          const updateAppointmentResponse = await fetch(`${API_URL}/appointments/${newAppointment._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          });

          if (updateAppointmentResponse.ok) {
            const updatedAppointment = await updateAppointmentResponse.json();
            console.log('✅ Updated appointment:', updatedAppointment);
            console.log('Status:', updateAppointmentResponse.status);

            // 6. Test DELETE /api/appointments/:id
            console.log('\n6. Testing DELETE /api/appointments/:id...');
            const deleteAppointmentResponse = await fetch(`${API_URL}/appointments/${newAppointment._id}`, {
              method: 'DELETE'
            });

            if (deleteAppointmentResponse.ok) {
              const deleteResult = await deleteAppointmentResponse.json();
              console.log('✅ Deleted appointment:', deleteResult);
              console.log('Status:', deleteAppointmentResponse.status);
            } else {
              console.log('❌ Failed to delete appointment:', deleteAppointmentResponse.status);
            }
          } else {
            console.log('❌ Failed to update appointment:', updateAppointmentResponse.status);
          }
        } else {
          console.log('❌ Failed to create appointment:', createAppointmentResponse.status);
        }
      } else {
        console.log('❌ Failed to create test patient:', createPatientResponse.status);
      }
    } else {
      console.log('✅ Found existing patients, using first patient for testing...');
      const firstPatient = patients[0];
      
      // Test creating appointment with existing patient
      console.log('\n3. Testing POST /api/appointments with existing patient...');
      const appointmentData = {
        patientId: firstPatient._id,
        date: "2024-12-25",
        time: "10:00",
        status: "Scheduled",
        treatmentDetails: ["Dental Cleaning", "Check-up"],
        caseNotes: "Test appointment",
        selectedTeeth: [11, 12, 13]
      };

      const createAppointmentResponse = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      if (createAppointmentResponse.ok) {
        const newAppointment = await createAppointmentResponse.json();
        console.log('✅ Created appointment:', newAppointment);
        console.log('Status:', createAppointmentResponse.status);
      } else {
        console.log('❌ Failed to create appointment:', createAppointmentResponse.status);
      }
    }

    // 7. Final test - GET all appointments
    console.log('\n7. Final test - GET /api/appointments...');
    const finalResponse = await fetch(`${API_URL}/appointments`);
    const finalAppointments = await finalResponse.json();
    console.log('✅ Final appointments list:', finalAppointments);
    console.log('Status:', finalResponse.status);

    console.log('\n🎉 Appointments module testing completed!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the test
testAppointments(); 