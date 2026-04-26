const Product = require('./models/Product');
const User = require('./models/User');
const mongoose = require('mongoose');
require('dotenv').config();


const sampleUsers = [
  {
    name: 'John Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    sellerInfo: {
      storeName: 'Tech Store',
      storeDescription: 'Premium electronics and gadgets'
    }
  },
  {
    name: 'Jane Customer',
    email: 'customer@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  }
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 128,
    category: 'Electronics',
    onSale: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    stock: 50,
    featured: true
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor',
    price: 199.99,
    rating: 4.7,
    reviews: 85,
    category: 'Electronics',
    onSale: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    stock: 30,
    featured: true
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable organic cotton t-shirt in various colors',
    price: 29.99,
    rating: 4.2,
    reviews: 67,
    category: 'Clothing',
    onSale: false,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    stock: 100,
    featured: false
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat for all types of yoga practice',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviews: 156,
    category: 'Sports',
    onSale: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    stock: 75,
    featured: true
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic coffee mugs',
    price: 45.99,
    rating: 4.3,
    reviews: 42,
    category: 'Home & Garden',
    onSale: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop',
    stock: 25,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('🗑Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('Creating sample users...');
    const createdUsers = await User.create(sampleUsers);
    const sellerId = createdUsers.find(user => user.role === 'seller')._id;

    console.log('Creating sample products...');
    const productsWithSeller = sampleProducts.map(product => ({
      ...product,
      sellerId
    }));
    await Product.create(productsWithSeller);

    console.log('   Database seeded successfully!');
    console.log('   Sample accounts:');
    console.log('   Seller: seller@example.com / password123');
    console.log('   Customer: customer@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
