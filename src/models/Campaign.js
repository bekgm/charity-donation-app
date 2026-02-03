const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required'],
  },
  goalAmount: {
    type: Number,
    required: [true, 'Goal amount is required'],
    min: [1, 'Goal amount must be at least 1'],
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Education', 'Healthcare', 'Environment', 'Poverty', 'Disaster Relief', 'Other'],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'closed'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Campaign+Image',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for percentage completed
campaignSchema.virtual('percentageCompleted').get(function () {
  return Math.min(Math.round((this.currentAmount / this.goalAmount) * 100), 100);
});

// Ensure virtuals are included in JSON
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
