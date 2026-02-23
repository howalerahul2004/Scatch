# ShopHub - E-Commerce Platform

A full-stack Node.js/Express e-commerce application with user authentication, product management, and shopping cart functionality.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Routes](#api-routes)
- [Features](#features)
- [Technology Stack](#technology-stack)

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**

Create a `.env` file in the root directory:
```
JWT_KEY=your_jwt_secret_key
EXPRESS_SESSION_SECRET=your_session_secret
NODE_ENV=development
```

3. **Database Configuration**

Update `config/development.json`:
```json
{
    "MONGODB_URI": "mongodb://localhost:27017"
}
```

4. **Start the Server**
```bash
npm start
```

Server runs on: `http://localhost:3000`

---

## API Routes

### 🏠 **Home & Main Routes** (from `/`)

| Method | Route | Description | Auth Required | View |
|--------|-------|-------------|----------------|------|
| GET | `/` | Home page with login/register options | ❌ | index.ejs |
| GET | `/shop` | Browse all products | ✅ | shop.ejs |
| GET | `/cart` | View shopping cart | ✅ | cart.ejs |
| GET | `/account` | User profile/account page | ✅ | account.ejs |

### 🛒 **Cart Routes** (from `/`)

| Method | Route | Description | Auth Required |
|--------|-------|-------------|----------------|
| GET | `/addtocart/:productid` | Add product to cart | ✅ |
| GET | `/removefromcart/:productid` | Remove product from cart | ✅ |
| GET | `/wishlist` | View wishlist | ✅ |
| GET | `/addtowishlist/:productid` | Add product to wishlist | ✅ |
| GET | `/removefromwishlist/:productid` | Remove product from wishlist | ✅ |
| GET | `/orders` | View all user orders | ✅ |
| GET | `/order/:id` | View order details | ✅ |
| POST | `/checkout` | Place new order | ✅ |

### 👤 **User Authentication Routes** (from `/users`)

| Method | Route | Description | Auth Required | View |
|--------|-------|-------------|----------------|------|
| GET | `/users/register` | Registration page | ❌ | register.ejs |
| GET | `/users/login` | Login page | ❌ | login.ejs |
| POST | `/users/register` | Register new user | ❌ | - |
| POST | `/users/login` | Login user | ❌ | - |
| GET | `/users/logout` | Logout user | ✅ | - |

**Register Payload (POST /users/register):**
```json
{
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Login Payload (POST /users/login):**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### 📦 **Product Management Routes** (from `/products`)

| Method | Route | Description | Auth Required |
|--------|-------|-------------|----------------|
| GET | `/products` | View all products (Admin dashboard) | ❌ |
| POST | `/products/create` | Create new product | ❌ |
| GET | `/products/edit/:id` | Edit product form | ❌ |
| POST | `/products/edit/:id` | Update product | ❌ |
| GET | `/products/delete/:id` | Delete a product | ❌ |

**Create Product Payload (POST /products/create):**
```
Content-Type: multipart/form-data

Fields:
- image: [File] - Product image file (OR use imageUrl instead)
- imageUrl: [String] - Direct URL to product image (OR use image file instead)
- name: [String] - Product name
- price: [Number] - Product price
- discount: [Number] - Discount amount (optional)
- bgcolor: [String] - Background color (hex code) - e.g., #FFD700
- panecolor: [String] - Panel color (hex code) - e.g., #FFFFFF
- textcolor: [String] - Text color (hex code) - e.g., #000000
```

**Image Upload Options:**
- **File Upload**: Upload an image file from your computer (JPG, PNG, GIF, WebP - Max 5MB)
- **Image URL**: Provide a direct URL to an image hosted online (e.g., `https://example.com/product.jpg`)

Example with File Upload:
```
name: "Leather Bag"
price: 2500
discount: 500
bgcolor: "#FFD700"
panecolor: "#FFFFFF"
textcolor: "#000000"
image: [File selected from computer]
```

Example with Image URL:
```
name: "Canvas Backpack"
price: 1800
discount: 300
bgcolor: "#FF6B6B"
panecolor: "#FFFFFF"
textcolor: "#000000"
imageUrl: "https://images.example.com/backpack.jpg"
```

### 👑 **Owner/Admin Routes** (from `/owners`)

| Method | Route | Description | Auth Required | Notes |
|--------|-------|-------------|----------------|-------|
| POST | `/owners/create` | Create owner account | ❌ | Dev mode only |
| GET | `/owners/admin` | Admin dashboard (create products form) | ❌ | renderscreateproducts.ejs |

**Create Owner Payload (POST /owners/create):**
```json
{
    "fullname": "Admin Name",
    "email": "admin@example.com",
    "password": "adminpassword"
}
```

---

## Features

### ✨ User Features
- ✅ User Registration & Login with JWT Authentication
- ✅ Secure Password Hashing (bcrypt)
- ✅ View Shopping Cart with Dynamic Calculations
- ✅ Add/Remove Products from Cart
- ✅ Add/Remove Products from Wishlist
- ✅ View Wishlist
- ✅ Search Products by Name
- ✅ View User Profile & Account Information
- ✅ Place Orders with Multiple Payment Methods
- ✅ View Order History and Order Details
- ✅ Auto price calculation (MRP - Discount + Platform Fee)
- ✅ Session Management with Flash Messages

### 🛠️ Admin Features
- ✅ Create Products with Images
- ✅ Edit Products (Name, Price, Discount, Colors, Images)
- ✅ Delete Products
- ✅ Add Images via File Upload or Image URL
- ✅ Set Custom Colors (Background, Panel, Text)
- ✅ View All Products Dashboard with Edit/Delete Options
- ✅ Product Image Upload (Buffer Storage or External URLs)

### 🔒 Security Features
- ✅ JWT Token Authentication
- ✅ Password Hashing with Bcrypt
- ✅ Cookie-based Sessions
- ✅ Login Middleware Protection
- ✅ Form Validation & Error Handling

---

## Technology Stack

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcrypt** - Password hashing
- **Cookie-parser** - Cookie handling
- **Express-session** - Session management
- **Connect-flash** - Flash message notifications

### Frontend
- **EJS** - Templating Engine
- **Tailwind CSS** - Utility-first CSS Framework
- **Remixicon** - Icon Library

### File Upload
- **Multer** - File upload middleware

### Development
- **Dotenv** - Environment variables
- **Config** - Configuration management
- **Debug** - Debugging utility

---

## Project Structure

```
shopHub/
├── config/
│   ├── development.json       # Database config
│   ├── mongoose-connection.js # DB connection setup
│   └── multer-config.js       # File upload config
├── controllers/
│   └── authController.js      # Auth logic (register, login, logout)
├── models/
│   ├── user.js                # User schema
│   ├── product.js             # Product schema
│   ├── owner.js               # Owner schema
│   ├── order.js               # Order schema
│   └── wishlist.js            # Wishlist schema
├── routes/
│   ├── index.js               # Main routes (home, shop, cart, account)
│   ├── userRouter.js          # User auth routes
│   ├── productsRouter.js      # Product management routes
│   └── ownersRouter.js        # Admin routes
├── middlewares/
│   └── isLoggedIn.js          # Authentication middleware
├── views/
│   ├── index.ejs              # Home page
│   ├── register.ejs           # Registration page
│   ├── login.ejs              # Login page
│   ├── shop.ejs               # Shop/Products page (with search)
│   ├── cart.ejs               # Shopping cart page
│   ├── account.ejs            # User account page
│   ├── wishlist.ejs           # Wishlist page
│   ├── orders.ejs             # Orders list page
│   ├── orderdetail.ejs        # Order details page
│   ├── createproducts.ejs     # Create product form
│   ├── edit.ejs               # Edit product form
│   ├── admin.ejs              # Admin dashboard
│   └── partials/
│       ├── header.ejs         # Navigation header
│       └── footer.ejs         # Footer
├── public/                    # Static files (CSS, JS, images)
├── utils/
│   └── generateToken.js       # JWT token generation
├── app.js                     # Express app entry point
├── package.json               # Project dependencies
├── .env                       # Environment variables
└── README.md                  # This file
```

---

## Data Models

### User Model
```javascript
{
    fullname: String,
    email: String,
    password: String (hashed),
    cart: [ObjectId],           // Array of product IDs
    orders: [ObjectId],         // Array of order IDs
    contact: Number,
    picture: String
}
```

### Product Model
```javascript
{
    image: Mixed,               // Can be Buffer (file upload) or String (URL)
    imageType: String,          // 'upload' for file or 'url' for external URL
    name: String,
    price: Number,
    discount: Number,
    bgcolor: String,            // Hex color code
    panecolor: String,          // Hex color code
    textcolor: String           // Hex color code
}
```

### Owner Model
```javascript
{
    fullname: String,
    email: String,
    password: String (hashed),
    products: Array,
    picture: String,
    gstin: String
}
```

### Order Model
```javascript
{
    user: ObjectId (ref: User),
    products: [ObjectId] (ref: Product),
    totalAmount: Number,
    totalMRP: Number,
    totalDiscount: Number,
    platformFee: Number,
    shippingFee: Number,
    status: String (pending|confirmed|shipped|delivered|cancelled),
    shippingAddress: String,
    paymentMethod: String (cod|card|wallet),
    createdAt: Date,
    deliveryDate: Date
}
```

### Wishlist Model
```javascript
{
    user: ObjectId (ref: User),
    products: [ObjectId] (ref: Product),
    createdAt: Date
}
```

---

## Example Usage

### 1. Register a New User
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a Product
Use the form at `/owners/admin` or POST to `/products/create` with multipart/form-data

### 4. View Shop
Navigate to `/shop` (requires login)

### 5. Add to Cart
```bash
curl -X GET http://localhost:3000/addtocart/[PRODUCT_ID] \
  -H "Cookie: token=[JWT_TOKEN]"
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Email or password is incorrect" | Wrong credentials | Verify email and password |
| "You need to login first" | Not authenticated | Login at `/users/login` |
| "Product not found" | Invalid product ID | Check product ID exists |
| "Cannot find module" | Missing dependency | Run `npm install` |
| "MONGODB_URI not defined" | Missing config | Check `config/development.json` |

---

## Future Enhancements

- [ ] Payment Integration (Stripe/Razorpay)
- [ ] Product Ratings & Reviews
- [ ] Advanced Search & Filter functionality
- [ ] Category Management
- [ ] Order Tracking with Real-time Updates
- [ ] Email Notifications
- [ ] Admin Analytics Dashboard
- [ ] Product Inventory Management
- [ ] User Profile Picture Upload
- [ ] Product Variants (sizes, colors, etc.)
- [ ] Bulk Product Import/Export
- [ ] Coupon & Discount Codes

---

**Happy Coding! 🚀**
