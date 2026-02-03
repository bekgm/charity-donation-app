const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Donation amount must be at least 1'],
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Campaign is required'],
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor is required'],
  },
  message: {
    type: String,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Update campaign amount after donation
donationSchema.post('save', async function () {
  const Campaign = mongoose.model('Campaign');
  
  if (this.status === 'completed') {
    await Campaign.findByIdAndUpdate(this.campaign, {
      $inc: { currentAmount: this.amount },
    });
  }
});

module.exports = mongoose.model('Donation', donationSchema);
