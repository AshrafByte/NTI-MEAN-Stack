const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
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

// @route   GET /api/orders
// @desc    Get user's order history - matches Angular account page
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort('-createdAt')
      .populate('items.productId', 'name image');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders: orders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', protect, [
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('cartItems').isArray({ min: 1 }).withMessage('Cart items are required')
], handleValidationErrors, async (req, res) => {
  try {
    const { shippingAddress, cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty'
      });
    }


    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          status: 'error',
          message: `Product not found: ${item.name}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }


      totalAmount += product.price * item.quantity;


      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }


    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount: totalAmount,
      shippingAddress
    });


    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      status: 'success',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating order',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('items.productId', 'name image');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          shippingAddress: order.shippingAddress,
          createdAt: order.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// @route   PATCH /api/orders/:id/cancel
// @desc    Cancel an order (only if pending or confirmed)
// @access  Private
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }


    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot cancel order. Current status: ${order.status}. Only pending or confirmed orders can be cancelled.`
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.status(200).json({
      status: 'success',
      message: `Order ${order.orderNumber} has been cancelled successfully`,
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          shippingAddress: order.shippingAddress,
          createdAt: order.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

module.exports = router;
