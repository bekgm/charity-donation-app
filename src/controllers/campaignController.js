const Campaign = require('../models/Campaign');
const sendEmail = require('../config/mail');

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (Admin/Moderator)
exports.createCampaign = async (req, res, next) => {
  try {
    const { title, description, goalAmount, category, endDate, imageUrl } = req.body;

    const campaign = await Campaign.create({
      title,
      description,
      goalAmount,
      category,
      endDate,
      imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
exports.getAllCampaigns = async (req, res, next) => {
  try {
    const { status, category } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const campaigns = await Campaign.find(filter)
      .populate('createdBy', 'username')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: campaigns.length,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
exports.getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('createdBy', 'username email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    res.status(200).json({
      success: true,
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Admin/Moderator)
exports.updateCampaign = async (req, res, next) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    // Check authorization
    if (campaign.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this campaign',
      });
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Admin only)
exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    await campaign.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
