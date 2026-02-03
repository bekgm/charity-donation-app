const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const sendEmail = require('../config/mail');

// ======================================
// CREATE DONATION
// ======================================
exports.createDonation = async (req, res, next) => {
  try {
    const { amount, campaign, message, isAnonymous } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation amount',
      });
    }

    const campaignDoc = await Campaign.findById(campaign);

    if (!campaignDoc) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    if (campaignDoc.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Campaign is not active',
      });
    }

    // ⛔ цель достигнута
    if (campaignDoc.currentAmount >= campaignDoc.goalAmount) {
      campaignDoc.status = 'completed';
      await campaignDoc.save();

      return res.status(400).json({
        success: false,
        message: 'Campaign goal already reached',
      });
    }

    const remaining =
      campaignDoc.goalAmount - campaignDoc.currentAmount;

    if (amount > remaining) {
      return res.status(400).json({
        success: false,
        message: `Max allowed donation is $${remaining}`,
      });
    }

    const donation = await Donation.create({
      amount,
      campaign,
      donor: req.user.id,
      message,
      isAnonymous: isAnonymous || false,
      status: 'completed',
    });

    campaignDoc.currentAmount += amount;

    if (campaignDoc.currentAmount >= campaignDoc.goalAmount) {
      campaignDoc.currentAmount = campaignDoc.goalAmount;
      campaignDoc.status = 'completed';
    }

    await campaignDoc.save();

    await donation.populate([
      { path: 'donor', select: 'username email' },
      { path: 'campaign', select: 'title' },
    ]);

    try {
      await sendEmail({
        email: donation.donor.email,
        subject: 'Thank You for Your Donation',
        message: `
          <h1>Thank You!</h1>
          <p>Dear ${donation.donor.username},</p>
          <p>You donated $${amount} to "${donation.campaign.title}".</p>
        `,
      });
    } catch (e) {
      console.error('Email error:', e.message);
    }

    res.status(201).json({
      success: true,
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET USER DONATIONS
// ======================================
exports.getUserDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({
      donor: req.user.id,
    })
      .populate('campaign', 'title goalAmount')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET SINGLE DONATION
// ======================================
exports.getDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('campaign', 'title')
      .populate('donor', 'username email');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET CAMPAIGN DONATIONS (PUBLIC)
// ======================================
exports.getCampaignDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({
      campaign: req.params.campaignId,
    })
      .populate('donor', 'username')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// DELETE DONATION (ADMIN)
// ======================================
exports.deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    await donation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Donation deleted',
    });
  } catch (error) {
    next(error);
  }
};
