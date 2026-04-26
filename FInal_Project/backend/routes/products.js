const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
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

// @route   GET /api/products
// @desc    Get all products - replaces ProductsService.getProducts()
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      page = 1,
      limit = 20,
      sort = '-createdAt',
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$text = { $search: search };
    }


    const skip = (page - 1) * limit;


    const products = await Product.find(filter)
      .populate('sellerId', 'name sellerInfo.storeName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: products.length,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: {
        products: products.map(product => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          category: product.category,
          onSale: product.onSale,
          isNew: product.isNew,
          image: product.image,
          stock: product.stock,
          featured: product.featured,
          sellerId: product.sellerId._id
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name sellerInfo.storeName');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }


    product.viewCount += 1;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          category: product.category,
          onSale: product.onSale,
          isNew: product.isNew,
          image: product.image,
          stock: product.stock,
          featured: product.featured,
          sellerId: product.sellerId._id
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// @route   GET /api/products/seller/:sellerId
// @desc    Get products by seller - matches ProductsService.getProductsBySeller()
// @access  Public
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: req.params.sellerId,
      isActive: true
    }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products: products.map(product => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          category: product.category,
          onSale: product.onSale,
          isNew: product.isNew,
          image: product.image,
          stock: product.stock,
          featured: product.featured,
          sellerId: product.sellerId
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching seller products',
      error: error.message
    });
  }
});

// @route   POST /api/products
// @desc    Create new product - matches Angular account page add product
// @access  Private (Sellers only)
router.post('/', protect, restrictTo('seller', 'admin'), [
  body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Product name must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('price').isNumeric().isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('category').isIn(['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty']).withMessage('Invalid category'),
  body('image').matches(/^https?:\/\/.+/).withMessage('Valid image URL required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], handleValidationErrors, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      sellerId: req.user.id
    };

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      data: {
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          category: product.category,
          onSale: product.onSale,
          isNew: product.isNew,
          image: product.image,
          stock: product.stock,
          featured: product.featured,
          sellerId: product.sellerId
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating product',
      error: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product - matches Angular account page edit product
// @access  Private (Product owner or admin)
router.put('/:id', protect, restrictTo('seller', 'admin'), [
  body('name').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }),
  body('price').optional().isNumeric().isFloat({ min: 0.01 }),
  body('category').optional().isIn(['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty']),
  body('image').optional().matches(/^https?:\/\/.+/),
  body('stock').optional().isInt({ min: 0 })
], handleValidationErrors, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }


    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own products'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        product: {
          id: updatedProduct._id,
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          originalPrice: updatedProduct.originalPrice,
          rating: updatedProduct.rating,
          reviews: updatedProduct.reviews,
          category: updatedProduct.category,
          onSale: updatedProduct.onSale,
          isNew: updatedProduct.isNew,
          image: updatedProduct.image,
          stock: updatedProduct.stock,
          featured: updatedProduct.featured,
          sellerId: updatedProduct.sellerId
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating product',
      error: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product - matches Angular account page delete product
// @access  Private (Product owner or admin)
router.delete('/:id', protect, restrictTo('seller', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }


    if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own products'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting product',
      error: error.message
    });
  }
});

module.exports = router;
