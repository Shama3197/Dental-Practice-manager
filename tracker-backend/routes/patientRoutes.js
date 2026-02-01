const express = require('express');
const Patient = require('../models/Patient');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single patient
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new patient
router.post('/', async (req, res) => {
  const { name, dateOfBirth, gender, contactNumber, email, address, medicalHistory, allergies, currentMedications } = req.body;
  try {
    const patient = new Patient({
      name,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      address,
      medicalHistory,
      allergies,
      currentMedications,
    });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a patient
router.put('/:id', async (req, res) => {
  const { name, dateOfBirth, gender, contactNumber, email, address, medicalHistory, allergies, currentMedications } = req.body;
  try {
    let patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.name = name;
    patient.dateOfBirth = dateOfBirth;
    patient.gender = gender;
    patient.contactNumber = contactNumber;
    patient.email = email;
    patient.address = address;
    patient.medicalHistory = medicalHistory;
    patient.allergies = allergies;
    patient.currentMedications = currentMedications;

    patient = await patient.save();
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload file for a patient
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `dental-practice-manager/patients/${patient._id}`,
      resource_type: "auto"
    });

    patient.files.push({
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
    });
    await patient.save();
    res.status(200).json({ message: 'File uploaded successfully', file: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

module.exports = router; 