---
description: Full-stack e-commerce platform for boutique candle maker with customer storefront and admin management system
details: >
  A complete e-commerce solution built with React and Node.js featuring a
  customer-facing storefront with browseable product catalog, persistent
  shopping cart, discount code system, and Stripe payment integration in GBP.
  Comprehensive admin dashboard enables full CRUD operations for products,
  order management with status tracking, discount code creation, and sales
  analytics. Backend built with Express and PostgreSQL for robust data
  management, implementing JWT authentication and bcrypt password hashing for
  security. Frontend uses Context API for state management, React Router for
  navigation, and Tailwind CSS for responsive design across all devices.
  Features real-time order processing, inventory tracking, and automated
  payment workflows. Deployed with CI/CD pipeline via GitHub for automatic
  deployments, frontend hosted on AWS Amplify, backend on AWS App Runner,
  and PostgreSQL database on Railway for scalable cloud infrastructure.
technologies:
  - react
  - nodejs
  - express
  - postgresql
  - stripe
  - tailwind
  - aws
hostedUrl: https://main.d3ot71att658vo.amplifyapp.com
---
# Candles - E-commerce Platform
A full-stack e-commerce platform for a boutique candle maker, featuring a customer-facing storefront and comprehensive admin management system.
Features
Customer Features

Browse product catalog
Shopping cart with persistent storage
Discount code system
Stripe payment integration (GBP)
Responsive design

Admin Features

Product management (Create, Read, Update, Delete)
Order management and tracking
Order status updates
Discount code creation and management
Sales analytics dashboard

Tech Stack
Frontend

React with Vite
Tailwind CSS for styling
React Router for navigation
Stripe.js for payments
Context API for state management

Backend

Node.js with Express
PostgreSQL database
Stripe payment processing
bcrypt for password hashing
JWT for authentication

Deployment

Frontend: AWS Amplify
Backend: AWS App Runner
Database: Railway PostgreSQL
CI/CD: GitHub (automatic deployments)

Project Structure
candle-shop/
├── candle-shop-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AdminNav.jsx
│   │   │   └── CheckoutForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Orders.jsx
│   │   │       └── Discounts.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
│
└── candle-shop-backend/
    ├── routes/
    │   ├── products.js
    │   ├── orders.js
    │   └── discounts.js
    ├── config/
    │   └── database.js
    ├── server.js
    └── package.json
Local Development Setup
Prerequisites

Node.js 18+
npm or yarn
PostgreSQL (local or Railway account)
Stripe account (test mode)

Backend Setup

Navigate to backend folder:

bash   cd candle-shop-backend

Install dependencies:

bash   npm install

Create .env file:

env   PORT=5001
   DATABASE_URL=postgresql://username:password@localhost:5432/candle_shop
   JWT_SECRET=your_secret_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_key

Set up database:

bash   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE candle_shop;
   
   # Run setup script (see setup-database.js)
   node setup-database.js

Start development server:

bash   npm run dev
Backend runs on http://localhost:5001
Frontend Setup

Navigate to frontend folder:

bash   cd candle-shop-frontend

Install dependencies:

bash   npm install

Create .env file:

env   VITE_API_URL=http://localhost:5001/api

Start development server:

bash   npm run dev
Frontend runs on http://localhost:5173
🗄 Database Schema
Tables
products

id, name, description, price, stock_quantity, image_url, is_active, created_at, updated_at

orders

id, customer_email, customer_name, customer_phone, shipping_address, total_amount, status, stripe_payment_intent_id, notes, created_at, updated_at

order_items

id, order_id, product_id, quantity, price_at_purchase

discount_codes

id, code, discount_type, discount_value, is_active, expires_at, created_at

users

id, email, password_hash, role, created_at

Deployment
Prerequisites

AWS Account
Railway Account
GitHub Account

Backend Deployment (AWS App Runner)

Push code to GitHub:

bash   git add .
   git commit -m "Initial commit"
   git push origin main

In AWS Console → App Runner:

Create service from GitHub repository
Select repository: candle-shop
Source directory: candle-shop-backend
Build command: npm install
Start command: node server.js
Port: 8080


Add environment variables in App Runner:

PORT: 8080
DATABASE_URL: (from Railway)
JWT_SECRET: (your secret)
STRIPE_SECRET_KEY: (from Stripe)
NODE_ENV: production



Frontend Deployment (AWS Amplify)

In AWS Console → Amplify:

Connect GitHub repository
Select repository: candle-shop
Root directory: candle-shop-frontend
Build command: npm run build
Output directory: dist


Add environment variable:

VITE_API_URL: (your App Runner URL + /api)



Database Setup (Railway)

In Railway:

Create new project
Provision PostgreSQL
Copy DATABASE_URL
Connect via psql and run table creation scripts



Stripe Testing
Use these test cards in development:
Successful payment:

Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits

Declined payment:

Card: 4000 0000 0000 0002

Environment Variables
Backend
envPORT=5001
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NODE_ENV=development
Frontend
envVITE_API_URL=http://localhost:5001/api
API Endpoints
Public Endpoints

GET /api/test - Health check
GET /api/products - Get all active products
GET /api/products/:id - Get single product
POST /api/orders/create-payment-intent - Create Stripe payment intent
POST /api/orders - Create order
POST /api/discounts/validate - Validate discount code

Admin Endpoints

POST /api/products - Create product
PUT /api/products/:id - Update product
DELETE /api/products/:id - Delete product
GET /api/orders - Get all orders
GET /api/orders/:id - Get single order
PUT /api/orders/:id/status - Update order status
GET /api/discounts - Get all discount codes
POST /api/discounts - Create discount code
PUT /api/discounts/:id - Update discount code
DELETE /api/discounts/:id - Delete discount code

Deployment Updates
Update Backend
bash# Make changes to backend code
git add candle-shop-backend/
git commit -m "Update backend feature"
git push
# App Runner automatically redeploys
Update Frontend
bash# Make changes to frontend code
git add candle-shop-frontend/
git commit -m "Update frontend feature"
git push
# Amplify automatically rebuilds and redeploys
Cost Breakdown
Development (Local):

Free

Production (AWS + Railway):

AWS App Runner: ~$5-7/month
AWS Amplify: Free tier (1000 build minutes/month)
Railway PostgreSQL: $5/month credit (free for small usage)
Total: ~$5-12/month

Troubleshooting
Backend won't start

Check DATABASE_URL is correct
Verify all environment variables are set
Check App Runner logs in AWS Console

Frontend can't connect to backend

Verify VITE_API_URL is correct
Check CORS settings in server.js
Ensure App Runner service is running

Database connection failed

Verify Railway database is running
Check DATABASE_URL format
Ensure IP is whitelisted (Railway allows all by default)

Stripe payments failing

Verify STRIPE_SECRET_KEY is set
Check publishable key in CheckoutPage.jsx
Use test cards in test mode

Learning Resources

React Documentation
Express.js Guide
PostgreSQL Tutorial
Stripe API Docs
AWS App Runner Docs
Tailwind CSS

Contributing
This is a client project. For future enhancements:

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request

Licence
MIT

Developer
Built by Michael Eddleston
Future Enhancements

 Admin authentication and login
 Image upload to S3 for products
 Email notifications for orders
 Customer accounts and order history
 Product reviews and ratings
 Inventory alerts
 Sales analytics and reporting
 Custom domain setup
 SEO optimization
 Newsletter subscription

Support
For issues or questions:

Check troubleshooting section
Review AWS CloudWatch logs
Check Railway database logs
Contact developer
