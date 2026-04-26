# Node.js + MongoDB Backend Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
- Copy `.env` file and update MongoDB connection string if needed
- Default settings work with local MongoDB

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
# Update MONGODB_URI in .env file
```

### 4. Seed Database with Sample Data
```bash
npm run seed
```

### 5. Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server will run on: http://localhost:3000

## 📋 Sample Test Accounts

After seeding, you can test with these accounts:

**Seller Account:**
- Email: `seller@example.com`
- Password: `password123`
- Role: Can manage products in account page

**Customer Account:**
- Email: `customer@example.com` 
- Password: `password123`
- Role: Regular user with order history

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (replaces ProductsService.getProducts())
- `GET /api/products/:id` - Get single product
- `GET /api/products/seller/:sellerId` - Get seller's products
- `POST /api/products` - Create product (sellers only)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's order history
- `POST /api/orders` - Create order from cart
- `GET /api/orders/:id` - Get order details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/seller-info` - Update seller info
- `GET /api/users/sellers` - Get all sellers

## 🔒 JWT Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ MongoDB Collections

The backend creates these collections that match your Angular interfaces:

- **users** - User accounts with authentication
- **products** - Product catalog with seller relations  
- **carts** - Shopping cart data per user
- **orders** - Order history and tracking

## 🔧 Next Steps

1. Update Angular services to use HTTP calls instead of mock data
2. Add JWT token storage and HTTP interceptors
3. Update environment files with backend URL
4. Test frontend-backend integration
