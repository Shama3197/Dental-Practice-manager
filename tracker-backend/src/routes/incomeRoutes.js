const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// Get all income entries with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      source, 
      minAmount, 
      maxAmount, 
      page = 1, 
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    if (source) filter.source = { $regex: source, $options: 'i' };
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const income = await Income.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    const total = await Income.countDocuments(filter);

    res.json({
      data: income,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get income statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate, source } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (source) filter.source = { $regex: source, $options: 'i' };

    const stats = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
          averageIncome: { $avg: '$amount' },
          count: { $sum: 1 },
          minAmount: { $min: '$amount' },
          maxAmount: { $max: '$amount' }
        }
      }
    ]);

    // Get monthly breakdown
    const monthlyStats = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Get source breakdown
    const sourceStats = await Income.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$source',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      summary: stats[0] || {
        totalIncome: 0,
        averageIncome: 0,
        count: 0,
        minAmount: 0,
        maxAmount: 0
      },
      monthly: monthlyStats,
      bySource: sourceStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single income entry
router.get('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id).populate('user', 'name email');
    if (!income) {
      return res.status(404).json({ message: 'Income entry not found' });
    }
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new income entry
router.post('/', async (req, res) => {
  try {
    const { date, amount, source, notes } = req.body;
    
    // Validate required fields
    if (!date || !amount || !source) {
      return res.status(400).json({ 
        message: 'Date, amount, and source are required' 
      });
    }

    const income = new Income({
      date: new Date(date),
      amount: parseFloat(amount),
      source,
      notes,
      user: req.user?.id || '64f8b8b8b8b8b8b8b8b8b8b8' // Default user ID for now
    });

    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update income entry
router.put('/:id', async (req, res) => {
  try {
    const { date, amount, source, notes } = req.body;
    
    const updateData = {};
    if (date) updateData.date = new Date(date);
    if (amount) updateData.amount = parseFloat(amount);
    if (source) updateData.source = source;
    if (notes !== undefined) updateData.notes = notes;

    const income = await Income.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!income) {
      return res.status(404).json({ message: 'Income entry not found' });
    }

    res.json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete income entry
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income entry not found' });
    }
    res.json({ message: 'Income entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk import income entries
router.post('/bulk', async (req, res) => {
  try {
    const { entries } = req.body;
    
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: 'Entries array is required' });
    }

    const incomeEntries = entries.map(entry => ({
      date: new Date(entry.date),
      amount: parseFloat(entry.amount),
      source: entry.source,
      notes: entry.notes,
      user: req.user?.id || '64f8b8b8b8b8b8b8b8b8b8b8'
    }));

    const savedEntries = await Income.insertMany(incomeEntries);
    res.status(201).json({
      message: `${savedEntries.length} income entries created successfully`,
      data: savedEntries
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 