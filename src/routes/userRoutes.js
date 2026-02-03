const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, updateProfileSchema } = require('../middleware/validate');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

module.exports = router;
