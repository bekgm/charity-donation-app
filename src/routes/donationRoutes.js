const express = require('express');
const {
  createDonation,
  getUserDonations,
  getDonation,
  getCampaignDonations,
  deleteDonation,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, donationSchema } = require('../middleware/validate');

const router = express.Router();

// Public routes
router.get('/campaign/:campaignId', getCampaignDonations);

// Protected routes
router.use(protect);

router.post('/', validate(donationSchema), createDonation);
router.get('/', getUserDonations);
router.get('/:id', getDonation);

// Admin only
router.delete('/:id', authorize('admin'), deleteDonation);

module.exports = router;
