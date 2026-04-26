const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

// Security middleware
app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(morgan('combined'));


app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'E-Commerce Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart',
      orders: '/api/orders'
    },
    documentation: 'See README.md for API documentation'
  });
});


app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' Connected to MongoDB');


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Frontend should connect to: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;
