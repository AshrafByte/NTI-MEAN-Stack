const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

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

// @route   GET /api/cart
// @desc    Get user's cart - matches Angular CartService
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.productId', 'name price image stock');

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.price,
            quantity: item.quantity,
            image: item.productId.image,
            stock: item.productId.stock,
            total: item.price * item.quantity
          })),
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart - matches Angular CartService.addToCart()
// @access  Private
router.post('/add', protect, [
  body('productId').isMongoId().withMessage('Valid product ID required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], handleValidationErrors, async (req, res) => {
  try {
    const { productId, quantity } = req.body;


    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }


    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {

      cart.items[existingItemIndex].quantity += quantity;
    } else {

      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart',
      data: {
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', protect, [
  body('productId').isMongoId().withMessage('Valid product ID required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative')
], handleValidationErrors, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    } else {
      // Update quantity
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Cart updated',
      data: {
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: {
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] }
    );

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;
