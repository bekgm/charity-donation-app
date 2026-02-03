const Joi = require('joi');

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }
    
    next();
  };
};

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
}).min(1); // At least one field required

const campaignSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).required(),
  goalAmount: Joi.number().min(1).required(),
  category: Joi.string().valid('Education', 'Healthcare', 'Environment', 'Poverty', 'Disaster Relief', 'Other').required(),
  endDate: Joi.date().greater('now').required(),
  imageUrl: Joi.string().uri().optional(),
});

const updateCampaignSchema = Joi.object({
  title: Joi.string().min(5).max(200),
  description: Joi.string().min(10),
  goalAmount: Joi.number().min(1),
  category: Joi.string().valid('Education', 'Healthcare', 'Environment', 'Poverty', 'Disaster Relief', 'Other'),
  status: Joi.string().valid('active', 'completed', 'closed'),
  endDate: Joi.date().greater('now'),
  imageUrl: Joi.string().uri(),
}).min(1);

const donationSchema = Joi.object({
  amount: Joi.number().min(1).required(),
  campaign: Joi.string().required(),
  message: Joi.string().max(500).optional(),
  isAnonymous: Joi.boolean().optional(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  campaignSchema,
  updateCampaignSchema,
  donationSchema,
};
