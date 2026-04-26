# E-Commerce Full Stack Application

A complete e-commerce platform built with the MEAN stack (MongoDB, Express.js, Angular 18, Node.js). The application provides a robust backend API and a responsive frontend interface for product management, shopping cart operations, and order processing.

[Demo Video](https://github.com/user-attachments/assets/3e6ef202-2e62-4cf9-bc48-46a6780c0204)

## Features

- **Authentication & Authorization**: Role-based access control using JWT (JSON Web Tokens).
- **Product Management**: Create, read, update, and delete products. Includes image uploads and inventory tracking.
- **Shopping Cart**: Persistent cart functionality for authenticated users.
- **Order Processing**: Secure checkout flow and order history tracking.
- **Security**: Implemented rate limiting, helmet headers, and request validation.

## Technology Stack

**Frontend**
- Angular 18
- Tailwind CSS
- RxJS
- TypeScript

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs (Password Hashing)
- express-validator (Request Validation)
- helmet & express-rate-limit (Security)

## Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a MongoDB Atlas URI)

## Project Structure

```text
NTI-MEAN-Stack/
├── frontend/          # Angular application
│   ├── src/           # Application source code
│   ├── public/        # Static assets
│   ├── angular.json   # Angular workspace configuration
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js API server
│   ├── models/        # Mongoose database schemas
│   ├── routes/        # Express API endpoints
│   ├── middleware/    # Custom middleware (auth, error handling)
│   ├── server.js      # Application entry point
│   ├── seed.js        # Database seeding utility
│   └── package.json   # Backend dependencies
└── README.md
```

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` directory with the following variables:

```ini
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:4200
```

Seed the database with sample data and start the server:

```bash
npm run seed
npm run dev
```

The backend server will start on `http://localhost:3000`.

### 2. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the Angular development server:

```bash
ng serve
```

The application will be available at `http://localhost:4200`.

## API Overview

The backend exposes a RESTful API with the following primary endpoints:

- `POST /api/auth/*` - User registration, login, and token generation.
- `GET /api/products/*` - Retrieve product listings and details.
- `POST /api/products/*` - Admin routes for product management.
- `GET /api/users/*` - User profile management.
- `ALL /api/cart/*` - Cart operations (add, remove, update quantities).
- `POST /api/orders/*` - Order placement and history retrieval.

Detailed API documentation is available in the `backend/README.md` file.

## Test Accounts

If you ran the `npm run seed` command during setup, the following test accounts are available:

**Seller/Admin Account**
- Email: `seller@example.com`
- Password: `password123`

**Customer Account**
- Email: `customer@example.com`
- Password: `password123`
