const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../config/mail');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Send welcome email
    try {
     const welcomeTemplate = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background:#f3f4f6; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:8px;">
    <h1 style="color:#2563eb;">Welcome to Charity Platform</h1>
    <p>Hello <strong>${user.username}</strong>,</p>
    <p>Thank you for joining our charity platform.</p>
    <p>You can now browse campaigns and make donations.</p>
  </div>
</body>
</html>
`;

await sendEmail({
  email: user.email,
  subject: 'Welcome to Charity Platform',
  message: welcomeTemplate,
});

    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if email fails
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
