const express = require('express');
const {
  createCampaign,
  getAllCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, campaignSchema, updateCampaignSchema } = require('../middleware/validate');

const router = express.Router();

// Public routes
router.get('/', getAllCampaigns);
router.get('/:id', getCampaign);

// Protected routes - Admin and Moderator only
router.post(
  '/',
  protect,
  authorize('admin', 'moderator'),
  validate(campaignSchema),
  createCampaign
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'moderator'),
  validate(updateCampaignSchema),
  updateCampaign
);

router.delete('/:id', protect, authorize('admin'), deleteCampaign);

module.exports = router;
