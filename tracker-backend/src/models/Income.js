const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Treatment', 'Consultation', 'Follow-up', 'Emergency', 'Lab Work', 'Other'],
    required: true
  },
  category: {
    type: String,
    enum: ['Preventive', 'Restorative', 'Surgical', 'Cosmetic', 'Orthodontic', 'Emergency', 'Other'],
    default: 'Other'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Insurance', 'Check', 'Bank Transfer', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Partial', 'Refunded', 'Cancelled'],
    default: 'Pending'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  receiptNumber: {
    type: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    claimNumber: String,
    coveredAmount: Number,
    patientResponsibility: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  createdBy: {
    type: String,
    default: 'System'
  },
  updatedBy: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

// Index for efficient queries
incomeSchema.index({ date: 1 });
incomeSchema.index({ patient: 1, date: 1 });
incomeSchema.index({ type: 1, date: 1 });
incomeSchema.index({ status: 1, date: 1 });
incomeSchema.index({ paymentMethod: 1, date: 1 });

// Virtual for net amount (after discount and tax)
incomeSchema.virtual('netAmount').get(function() {
  return this.amount - this.discount + this.tax;
});

// Virtual for formatted date
incomeSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Method to calculate total with tax and discount
incomeSchema.methods.calculateTotal = function() {
  return this.amount - this.discount + this.tax;
};

// Static method to get income by date range
incomeSchema.statics.getByDateRange = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('patient', 'name email phone');
};

// Static method to get income by type
incomeSchema.statics.getByType = function(type) {
  return this.find({ type }).populate('patient', 'name email phone');
};

// Static method to get income statistics
incomeSchema.statics.getStats = function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$amount' },
        totalDiscount: { $sum: '$discount' },
        totalTax: { $sum: '$tax' },
        count: { $sum: 1 },
        averageAmount: { $avg: '$amount' }
      }
    }
  ]);
};

// Static method to get income by payment method
incomeSchema.statics.getByPaymentMethod = function(paymentMethod, startDate, endDate) {
  const filter = { paymentMethod };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  
  return this.find(filter).populate('patient', 'name email phone');
};

// Pre-save middleware to generate invoice number if not provided
incomeSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoiceNumber = `INV-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Income', incomeSchema); 