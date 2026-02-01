const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

// Middleware to verify JWT token
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      email,
      practiceName,
      licenseNumber
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username },
        { email },
        { licenseNumber }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this username, email, or license number already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      password,
      fullName,
      email,
      practiceName,
      licenseNumber,
      isVerified: true // Temporarily set to true for development
    });

    await user.save();

    // Temporarily disabled email sending for development
    // await sendVerificationEmail(user.email, user._id);

    res.status(201).json({
      message: 'Registration successful. Email verification bypassed for development.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.accountLocked) {
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(401).json({
          message: 'Account is locked. Please try again later.'
        });
      } else {
        // Reset lock if lock period has expired
        await user.resetFailedLoginAttempts();
      }
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementFailedLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`User ${user.username} isVerified: ${user.isVerified}`);

    // Check if user is verified (temporarily bypassed for development)
    // if (!user.isVerified) {
    //   return res.status(401).json({
    //     message: 'Please verify your email before logging in'
    //   });
    // }

    // Reset failed login attempts on successful login
    await user.resetFailedLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        practiceName: user.practiceName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify email
router.get('/verify/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 