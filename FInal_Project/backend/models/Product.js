const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty']
  },
  onSale: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
    match: [/^https?:\/\/.+/, 'Please provide a valid image URL']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID is required']
  },
  // Additional fields for enhanced functionality
  images: [{
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide valid image URLs']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.index({ category: 1, featured: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});


productSchema.virtual('seller', {
  ref: 'User',
  localField: 'sellerId',
  foreignField: '_id',
  justOne: true
});


productSchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.onSale = true;
  } else {
    this.onSale = false;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
