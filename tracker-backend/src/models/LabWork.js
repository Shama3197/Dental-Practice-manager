const mongoose = require('mongoose');

const labWorkSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Delivered'], default: 'Pending' },
  sentDate: { type: Date },
  receivedDate: { type: Date },
  notes: String,
  cost: Number,
  labName: String,
  files: [String]
}, { timestamps: true });

module.exports = mongoose.model('LabWork', labWorkSchema);