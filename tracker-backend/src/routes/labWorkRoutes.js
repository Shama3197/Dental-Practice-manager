const express = require('express');
const LabWork = require('../models/LabWork');
const Patient = require('../models/Patient');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all lab work entries with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { status, caseType, patientId, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (caseType) filter.caseType = caseType;
    if (patientId) filter.patientId = patientId;

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const labWorks = await LabWork.find(filter)
      .populate('patientId', 'name contactNumber email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await LabWork.countDocuments(filter);
    
    res.json({
      data: labWorks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching labwork:', err);
    res.status(500).json({ error: 'Failed to fetch labwork entries' });
  }
});

// Get labwork statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await LabWork.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await LabWork.countDocuments();
    const caseTypeStats = await LabWork.aggregate([
      {
        $group: {
          _id: '$caseType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      statusStats: stats,
      total,
      caseTypeStats: caseTypeStats.slice(0, 5) // Top 5 case types
    });
  } catch (err) {
    console.error('Error fetching labwork stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get a single lab work entry
router.get('/:id', async (req, res) => {
  try {
    const labWork = await LabWork.findById(req.params.id)
      .populate('patientId', 'name contactNumber email address');
    
    if (!labWork) {
      return res.status(404).json({ error: 'Lab work entry not found' });
    }
    
    res.json(labWork);
  } catch (err) {
    console.error('Error fetching labwork:', err);
    res.status(500).json({ error: 'Failed to fetch lab work entry' });
  }
});

// Create a new lab work entry
router.post('/', async (req, res) => {
  try {
    const labWork = new LabWork(req.body);
    await labWork.save();
    
    const populatedLabWork = await LabWork.findById(labWork._id)
      .populate('patientId', 'name contactNumber email');
    
    res.status(201).json(populatedLabWork);
  } catch (err) {
    console.error('Error creating labwork:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create lab work entry' });
  }
});

// Update a lab work entry
router.put('/:id', async (req, res) => {
  try {
    const labWork = await LabWork.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('patientId', 'name contactNumber email');
    
    if (!labWork) {
      return res.status(404).json({ error: 'Lab work entry not found' });
    }
    
    res.json(labWork);
  } catch (err) {
    console.error('Error updating labwork:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update lab work entry' });
  }
});

// Delete a lab work entry
router.delete('/:id', async (req, res) => {
  try {
    const labWork = await LabWork.findByIdAndDelete(req.params.id);
    
    if (!labWork) {
      return res.status(404).json({ error: 'Lab work entry not found' });
    }
    
    res.json({ message: 'Lab work entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting labwork:', err);
    res.status(500).json({ error: 'Failed to delete lab work entry' });
  }
});

// Upload file for lab work
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const labWork = await LabWork.findById(req.params.id);
    if (!labWork) {
      return res.status(404).json({ error: 'Lab work entry not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: `dental-practice-manager/labwork/${labWork._id}`,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'File upload failed' });
        }

        labWork.labFiles.push({
          fileName: req.file.originalname,
          fileUrl: result.secure_url,
          fileType: req.file.mimetype,
        });
        
        labWork.save().then(() => {
          res.json({ 
            message: 'File uploaded successfully', 
            file: {
              fileName: req.file.originalname,
              fileUrl: result.secure_url,
              fileType: req.file.mimetype,
            }
          });
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(result);

  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Add progress image
router.post('/:id/progress', upload.single('image'), async (req, res) => {
  try {
    const labWork = await LabWork.findById(req.params.id);
    if (!labWork) {
      return res.status(404).json({ error: 'Lab work entry not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: `dental-practice-manager/labwork/${labWork._id}/progress`,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Image upload failed' });
        }

        const progressImage = {
          url: result.secure_url,
          stage: req.body.stage || 'Progress Update',
          description: req.body.description || '',
          uploadedAt: new Date()
        };

        labWork.progressImages.push(progressImage);
        
        labWork.save().then(() => {
          res.json({ 
            message: 'Progress image uploaded successfully', 
            progressImage 
          });
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(result);

  } catch (err) {
    console.error('Error uploading progress image:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Update lab work status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const labWork = await LabWork.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        notes: notes ? `${labWork.notes || ''}\n${new Date().toISOString()}: ${notes}`.trim() : labWork.notes
      },
      { new: true }
    ).populate('patientId', 'name contactNumber email');
    
    if (!labWork) {
      return res.status(404).json({ error: 'Lab work entry not found' });
    }
    
    res.json(labWork);
  } catch (err) {
    console.error('Error updating labwork status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router; 