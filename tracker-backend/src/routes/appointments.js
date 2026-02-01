const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../../controllers/appointmentsController');

// Get all appointments
router.get('/', getAppointments);

// Get single appointment
router.get('/:id', getAppointmentById);

// Create new appointment
router.post('/', createAppointment);

// Update appointment
router.put('/:id', updateAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);

module.exports = router; 