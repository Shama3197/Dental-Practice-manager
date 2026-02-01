const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const LabWork = require('../models/LabWork');
const Income = require('../models/Income');

// Get comprehensive dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Appointments analytics
    const appointmentStats = await Appointment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          scheduled: { $sum: { $cond: [{ $eq: ['$status', 'Scheduled'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } }
        }
      }
    ]);

    // Patient analytics
    const patientStats = await Patient.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          newThisPeriod: { $sum: 1 }
        }
      }
    ]);

    // Income analytics
    const incomeStats = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
          averageIncome: { $avg: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Lab work analytics
    const labWorkStats = await LabWork.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          received: { $sum: { $cond: [{ $eq: ['$status', 'Received'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      appointments: appointmentStats[0] || { total: 0, scheduled: 0, completed: 0, cancelled: 0 },
      patients: patientStats[0] || { total: 0, newThisPeriod: 0 },
      income: incomeStats[0] || { totalIncome: 0, averageIncome: 0, count: 0 },
      labWork: labWorkStats[0] || { total: 0, pending: 0, received: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointment reports
router.get('/appointments', async (req, res) => {
  try {
    const { startDate, endDate, status, treatmentType, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (status) filter.status = status;
    if (treatmentType) filter.treatmentDetails = { $in: [treatmentType] };

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(filter);

    // Get appointment statistics
    const stats = await Appointment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient reports
router.get('/patients', async (req, res) => {
  try {
    const { startDate, endDate, gender, ageRange, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (gender) filter.gender = gender;

    // Age range filter
    if (ageRange) {
      const today = new Date();
      const [minAge, maxAge] = ageRange.split('-').map(Number);
      if (minAge && maxAge) {
        const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
        const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
        filter.dateOfBirth = { $gte: minDate, $lte: maxDate };
      }
    }

    const patients = await Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Patient.countDocuments(filter);

    // Get patient demographics
    const demographics = await Patient.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      demographics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get income reports
router.get('/income', async (req, res) => {
  try {
    const { startDate, endDate, category, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (category) filter.category = category;

    const income = await Income.find(filter)
      .populate('patient', 'name email phone')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Income.countDocuments(filter);

    // Get income statistics
    const stats = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      data: income,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get lab work reports
router.get('/labwork', async (req, res) => {
  try {
    const { startDate, endDate, status, labName, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (status) filter.status = status;
    if (labName) filter.labName = { $regex: labName, $options: 'i' };

    const labWork = await LabWork.find(filter)
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await LabWork.countDocuments(filter);

    // Get lab work statistics
    const stats = await LabWork.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      data: labWork,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export data to CSV
router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate, format = 'csv' } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let data;
    let filename;

    switch (type) {
      case 'appointments':
        data = await Appointment.find(filter).populate('patient', 'name email phone');
        filename = 'appointments';
        break;
      case 'patients':
        data = await Patient.find(filter);
        filename = 'patients';
        break;
      case 'income':
        data = await Income.find(filter).populate('patient', 'name email phone');
        filename = 'income';
        break;
      case 'labwork':
        data = await LabWork.find(filter).populate('patient', 'name email phone');
        filename = 'labwork';
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]._doc || data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value)}"`;
      }
      return `"${value || ''}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

module.exports = router; 