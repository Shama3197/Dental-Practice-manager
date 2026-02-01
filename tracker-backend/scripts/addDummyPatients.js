const mongoose = require('mongoose');
const Patient = require('../models/Patient');
require('dotenv').config();

const dummyPatients = [
  {
    name: "John Smith",
    dateOfBirth: "1980-05-15",
    gender: "Male",
    contactNumber: "555-0123",
    email: "john.smith@email.com",
    address: "123 Main St, Anytown, USA",
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "555-0124"
    },
    medicalHistory: {
      conditions: [
        {
          name: "Hypertension",
          diagnosedDate: "2015-03-10",
          status: "Chronic",
          notes: "Well controlled with medication"
        }
      ]
    },
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2015-03-10",
        prescribedBy: "Dr. Johnson",
        notes: "For blood pressure"
      }
    ],
    allergies: [
      {
        substance: "Penicillin",
        reaction: "Rash",
        severity: "Moderate",
        notes: "Avoid all penicillin-based antibiotics"
      }
    ],
    notes: "Regular check-ups every 6 months"
  },
  {
    name: "Sarah Johnson",
    dateOfBirth: "1992-08-23",
    gender: "Female",
    contactNumber: "555-0125",
    email: "sarah.j@email.com",
    address: "456 Oak Ave, Somewhere, USA",
    emergencyContact: {
      name: "Mike Johnson",
      relationship: "Brother",
      phone: "555-0126"
    },
    medicalHistory: {
      conditions: [
        {
          name: "Asthma",
          diagnosedDate: "2000-06-15",
          status: "Active",
          notes: "Exercise-induced"
        }
      ]
    },
    medications: [
      {
        name: "Albuterol",
        dosage: "90mcg",
        frequency: "As needed",
        startDate: "2000-06-15",
        prescribedBy: "Dr. Williams",
        notes: "Inhaler for asthma"
      }
    ],
    allergies: [
      {
        substance: "Shellfish",
        reaction: "Anaphylaxis",
        severity: "Severe",
        notes: "Carry EpiPen"
      }
    ],
    notes: "Prefers morning appointments"
  },
  {
    name: "Michael Brown",
    dateOfBirth: "1975-11-30",
    gender: "Male",
    contactNumber: "555-0127",
    email: "m.brown@email.com",
    address: "789 Pine Rd, Elsewhere, USA",
    emergencyContact: {
      name: "Lisa Brown",
      relationship: "Spouse",
      phone: "555-0128"
    },
    medicalHistory: {
      conditions: [
        {
          name: "Type 2 Diabetes",
          diagnosedDate: "2010-01-20",
          status: "Chronic",
          notes: "Diet controlled"
        }
      ]
    },
    medications: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2010-01-20",
        prescribedBy: "Dr. Davis",
        notes: "For diabetes management"
      }
    ],
    allergies: [
      {
        substance: "Latex",
        reaction: "Contact dermatitis",
        severity: "Mild",
        notes: "Use latex-free gloves"
      }
    ],
    notes: "Needs extra time for procedures due to anxiety"
  }
];

const addDummyPatients = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing patients
    await Patient.deleteMany({});
    console.log('Cleared existing patients');

    // Add new dummy patients
    const patients = await Patient.insertMany(dummyPatients);
    console.log(`Added ${patients.length} dummy patients`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addDummyPatients(); 