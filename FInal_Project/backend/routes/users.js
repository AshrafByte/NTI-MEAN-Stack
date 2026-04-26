const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/users/profile
// @desc    Get user profile - matches Angular account page
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials,
          sellerInfo: user.sellerInfo,
          emailVerified: user.emailVerified,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile - matches Angular account page profile update
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('role').optional().isIn(['user', 'seller']).withMessage('Role must be user or seller')
], handleValidationErrors, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'email', 'avatar', 'role'];
    const updates = {};


    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });


    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: req.user.id }
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/seller-info
// @desc    Update seller information
// @access  Private (Sellers only)
router.put('/seller-info', protect, restrictTo('seller'), [
  body('storeName').optional().trim().isLength({ min: 2, max: 100 }),
  body('storeDescription').optional().trim().isLength({ max: 500 })
], handleValidationErrors, async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'sellerInfo.storeName': storeName,
        'sellerInfo.storeDescription': storeDescription
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        sellerInfo: user.sellerInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating seller info',
      error: error.message
    });
  }
});

// @route   GET /api/users/sellers
// @desc    Get all sellers (for public display)
// @access  Public
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({
      role: 'seller',
      isActive: true
    }).select('name sellerInfo avatar');

    res.status(200).json({
      status: 'success',
      results: sellers.length,
      data: {
        sellers: sellers.map(seller => ({
          id: seller._id,
          name: seller.name,
          avatar: seller.avatar,
          storeName: seller.sellerInfo.storeName,
          storeDescription: seller.sellerInfo.storeDescription,
          isVerified: seller.sellerInfo.isVerifiedSeller
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching sellers',
      error: error.message
    });
  }
});

module.exports = router;
