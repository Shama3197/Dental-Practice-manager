require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('../src/models/Patient');
const Appointment = require('../src/models/Appointment');
const LabWork = require('../src/models/LabWork');
const Income = require('../src/models/Income');

// Mock data arrays
const firstNames = [
  'John', 'Sarah', 'Mike', 'Emily', 'Robert', 'Jennifer', 'David', 'Lisa',
  'Michael', 'Jessica', 'James', 'Amanda', 'William', 'Melissa', 'Richard',
  'Michelle', 'Joseph', 'Kimberly', 'Thomas', 'Amy', 'Charles', 'Angela',
  'Daniel', 'Ashley', 'Matthew', 'Stephanie', 'Anthony', 'Nicole', 'Mark',
  'Elizabeth', 'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen'
];

const streets = [
  'Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 'Cedar Ln',
  'Park Ave', 'Washington St', 'Lincoln Ave', 'Jefferson Dr', 'Madison St',
  'Adams Ave', 'Jackson Blvd', 'Monroe St', 'Harrison Ave'
];

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];

const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA'];

const insuranceProviders = ['Blue Cross', 'Aetna', 'Cigna', 'United Health', 'Humana', 'MetLife', 'Delta Dental'];

const treatmentTypes = [
  'Dental Cleaning', 'Filling', 'Root Canal', 'Crown', 'Extraction',
  'Check-up', 'Orthodontic Treatment', 'Teeth Whitening', 'Crown Placement',
  'Deep Cleaning', 'Consultation', 'X-Ray', 'Denture', 'Bridge', 'Veneer', 'Implant'
];

const treatmentDetails = {
  'Dental Cleaning': ['Scaling', 'Polishing', 'Fluoride Treatment'],
  'Filling': ['Cavity Preparation', 'Composite Filling'],
  'Root Canal': ['Access Opening', 'Pulp Removal', 'Cleaning', 'Filling'],
  'Crown': ['Tooth Preparation', 'Impression', 'Temporary Crown'],
  'Extraction': ['Anesthesia', 'Tooth Removal', 'Sutures'],
  'Check-up': ['Examination', 'X-Ray Review'],
  'Crown Placement': ['Crown Fitting', 'Cementation'],
  'Deep Cleaning': ['Scaling', 'Root Planing'],
  'Denture': ['Impression', 'Fitting', 'Adjustment'],
  'Bridge': ['Preparation', 'Impression', 'Placement'],
  'Veneer': ['Preparation', 'Bonding'],
  'Implant': ['Placement', 'Healing Cap']
};

const labTypes = ['Crown', 'Bridge', 'Denture', 'Veneer', 'Implant', 'Night Guard', 'Retainer'];

const labNames = [
  'Dental Lab Pro', 'Precision Dental Lab', 'Quality Dental Lab',
  'Elite Dental Lab', 'Advanced Dental Lab', 'Master Dental Lab',
  'Prosthetic Solutions', 'Crown & Bridge Specialists'
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

// Treatment costs (in USD)
const treatmentCosts = {
  'Dental Cleaning': { min: 80, max: 150 },
  'Filling': { min: 150, max: 400 },
  'Root Canal': { min: 800, max: 1500 },
  'Crown': { min: 1000, max: 2000 },
  'Extraction': { min: 150, max: 400 },
  'Check-up': { min: 50, max: 150 },
  'Orthodontic Treatment': { min: 3000, max: 8000 },
  'Teeth Whitening': { min: 300, max: 800 },
  'Crown Placement': { min: 1000, max: 2000 },
  'Deep Cleaning': { min: 200, max: 400 },
  'Consultation': { min: 50, max: 150 },
  'X-Ray': { min: 50, max: 200 },
  'Denture': { min: 1500, max: 4000 },
  'Bridge': { min: 2000, max: 5000 },
  'Veneer': { min: 1000, max: 2500 },
  'Implant': { min: 3000, max: 6000 }
};

const labCosts = {
  'Crown': { min: 400, max: 800 },
  'Bridge': { min: 800, max: 2000 },
  'Denture': { min: 600, max: 1500 },
  'Veneer': { min: 500, max: 1200 },
  'Implant': { min: 1500, max: 3000 },
  'Night Guard': { min: 200, max: 500 },
  'Retainer': { min: 300, max: 600 }
};

// Helper functions
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startDate, endDate) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'email.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomElement(domains)}`;
}

function generatePhone() {
  const areaCode = randomInt(200, 999);
  const exchange = randomInt(200, 999);
  const number = randomInt(1000, 9999);
  return `(${areaCode}) ${exchange}-${number}`;
}

function generateDateOfBirth() {
  const year = randomInt(1950, 2005);
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);
  return new Date(year, month, day);
}

async function seedData() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dental-practice-manager';
    console.log(`🔌 Connecting to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***@')}`); // Hide credentials in log
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await LabWork.deleteMany({});
    await Income.deleteMany({});
    console.log('✅ Existing data cleared');

    // Calculate date range (3 days before today to 5 days ahead)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 3);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 5);
    endDate.setHours(23, 59, 59, 999);

    console.log(`📅 Date range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);

    // Create 30 mock patients
    console.log('👥 Creating patients...');
    const patients = [];
    for (let i = 0; i < 30; i++) {
      const firstName = randomElement(firstNames);
      const lastName = randomElement(lastNames);
      const patient = new Patient({
        name: `${firstName} ${lastName}`,
        email: generateEmail(firstName, lastName),
        phone: generatePhone(),
        dateOfBirth: generateDateOfBirth(),
        gender: randomElement(['Male', 'Female', 'Other']),
        address: {
          street: `${randomInt(100, 9999)} ${randomElement(streets)}`,
          city: randomElement(cities),
          state: randomElement(states),
          zipCode: randomInt(10000, 99999).toString(),
          country: 'USA'
        },
        emergencyContact: {
          name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
          relationship: randomElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
          phone: generatePhone(),
          email: generateEmail(randomElement(firstNames), randomElement(lastNames))
        },
        insurance: {
          provider: randomElement(insuranceProviders),
          policyNumber: `POL-${randomInt(100000, 999999)}`,
          groupNumber: `GRP-${randomInt(1000, 9999)}`
        },
        status: randomElement(['Active', 'Active', 'Active', 'Inactive', 'New']), // More active patients
        notes: i % 5 === 0 ? `Regular patient. Last visit was ${randomInt(1, 6)} months ago.` : undefined
      });
      await patient.save();
      patients.push(patient);
    }
    console.log(`✅ Created ${patients.length} patients`);

    // Create appointments distributed across the date range
    console.log('📅 Creating appointments...');
    const appointments = [];
    const appointmentsPerDay = [2, 3, 4, 5, 6, 4, 3, 2, 3]; // Varying appointments per day
    
    let dayIndex = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const appointmentsToday = appointmentsPerDay[dayIndex % appointmentsPerDay.length];
      const dateStr = d.toISOString().split('T')[0];
      
      for (let i = 0; i < appointmentsToday; i++) {
        const patient = randomElement(patients);
        const treatmentType = randomElement(treatmentTypes);
        const timeSlot = randomElement(timeSlots);
        const cost = randomInt(treatmentCosts[treatmentType].min, treatmentCosts[treatmentType].max);
        
        // Determine status based on date
        let status = 'Scheduled';
        if (d < today) {
          status = randomElement(['Completed', 'Completed', 'Completed', 'Cancelled', 'No Show']);
        } else if (d.getTime() === today.getTime()) {
          status = randomElement(['Scheduled', 'Confirmed', 'In Progress']);
        }
        
        const appointment = new Appointment({
          patient: patient._id,
          date: new Date(d),
          time: timeSlot,
          duration: randomElement([30, 45, 60, 90, 120]),
          status: status,
          treatmentType: treatmentType,
          treatmentDetails: treatmentDetails[treatmentType] || [treatmentType],
          notes: `Appointment for ${treatmentType}. ${randomElement(['Patient prefers morning appointments.', 'Follow-up visit.', 'Regular checkup.', ''])}`,
          cost: cost,
          paymentStatus: status === 'Completed' ? randomElement(['Paid', 'Paid', 'Paid', 'Partial']) : 'Pending',
          reminderSent: d > today && Math.random() > 0.5
        });
        
        await appointment.save();
        appointments.push(appointment);
        
        // Create income entry for completed appointments
        if (status === 'Completed') {
          const income = new Income({
            patient: patient._id,
            appointment: appointment._id,
            amount: cost,
            type: 'Treatment',
            category: treatmentType.includes('Cleaning') || treatmentType.includes('Check-up') ? 'Preventive' :
                     treatmentType.includes('Filling') || treatmentType.includes('Crown') || treatmentType.includes('Root Canal') ? 'Restorative' :
                     treatmentType.includes('Extraction') ? 'Surgical' :
                     treatmentType.includes('Whitening') || treatmentType.includes('Veneer') ? 'Cosmetic' : 'Other',
            paymentMethod: randomElement(['Cash', 'Credit Card', 'Debit Card', 'Insurance', 'Check']),
            status: appointment.paymentStatus === 'Paid' ? 'Paid' : appointment.paymentStatus === 'Partial' ? 'Partial' : 'Pending',
            date: new Date(d),
            description: `${treatmentType} - ${patient.name}`,
            discount: Math.random() > 0.8 ? randomInt(10, 50) : 0,
            tax: Math.round(cost * 0.08), // 8% tax
            notes: `Payment for ${treatmentType}`
          });
          await income.save();
        }
      }
      dayIndex++;
    }
    console.log(`✅ Created ${appointments.length} appointments`);

    // Create lab work entries distributed across the date range
    console.log('🔬 Creating lab work entries...');
    const labWorkEntries = [];
    const labWorkPerDay = [1, 2, 1, 2, 1, 1, 2, 1, 1]; // Varying lab work per day
    
    dayIndex = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const labWorkToday = labWorkPerDay[dayIndex % labWorkPerDay.length];
      
      for (let i = 0; i < labWorkToday; i++) {
        const patient = randomElement(patients);
        const labType = randomElement(labTypes);
        const labName = randomElement(labNames);
        const cost = randomInt(labCosts[labType].min, labCosts[labType].max);
        
        // Determine status based on date
        let status = 'Pending';
        if (d < today) {
          status = randomElement(['Completed', 'Delivered', 'In Progress']);
        } else if (d.getTime() === today.getTime()) {
          status = randomElement(['Pending', 'In Progress']);
        }
        
        const sentDate = new Date(d);
        let receivedDate = null;
        if (status === 'Completed' || status === 'Delivered') {
          receivedDate = new Date(sentDate);
          receivedDate.setDate(receivedDate.getDate() + randomInt(7, 21)); // 1-3 weeks later
        }
        
        const labWork = new LabWork({
          patient: patient._id,
          type: labType,
          status: status,
          sentDate: sentDate,
          receivedDate: receivedDate,
          notes: `${labType} for ${patient.name}. ${randomElement(['Standard delivery.', 'Rush order.', 'Follow-up required.', ''])}`,
          cost: cost,
          labName: labName
        });
        
        await labWork.save();
        labWorkEntries.push(labWork);
        
        // Create income entry for completed/delivered lab work
        if (status === 'Completed' || status === 'Delivered') {
          const income = new Income({
            patient: patient._id,
            amount: cost,
            type: 'Lab Work',
            category: 'Restorative',
            paymentMethod: randomElement(['Cash', 'Credit Card', 'Insurance', 'Check']),
            status: randomElement(['Paid', 'Paid', 'Pending']),
            date: receivedDate || sentDate,
            description: `${labType} - ${patient.name} (${labName})`,
            discount: Math.random() > 0.9 ? randomInt(5, 30) : 0,
            tax: Math.round(cost * 0.08),
            notes: `Lab work payment for ${labType}`
          });
          await income.save();
        }
      }
      dayIndex++;
    }
    console.log(`✅ Created ${labWorkEntries.length} lab work entries`);

    // Summary
    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    console.log('\n📊 Seed Data Summary:');
    console.log(`   Patients: ${patients.length}`);
    console.log(`   Appointments: ${appointments.length}`);
    console.log(`   Lab Work Entries: ${labWorkEntries.length}`);
    console.log(`   Income Entries: ${totalIncome[0]?.total ? totalIncome[0].total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0'}`);
    console.log(`   Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
    
    console.log('\n✅ Seed data created successfully!');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
      console.error('\n💡 Make sure MongoDB is running!');
      console.error('   - If using local MongoDB: Start MongoDB service');
      console.error('   - If using MongoDB Atlas: Check your connection string in .env file');
      console.error('   - Connection string format: mongodb://localhost:27017/dental-practice-manager');
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Run the seed function
seedData();
