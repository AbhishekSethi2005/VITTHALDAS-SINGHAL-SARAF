# 💎 Vitthaldas Singhal Saraf – Luxury Jewellery E-Commerce Platform

A full-stack luxury jewellery e-commerce platform built for **Vitthaldas Singhal Saraf**, a traditional Indian jewellery brand.
The platform provides a premium online shopping experience with a modern luxury UI, dynamic pricing engine, customer management system, admin dashboard, order tracking, notifications, and advanced product management.

---

# ✨ Features

## 🛍 Customer Features

* Luxury jewellery storefront
* Product browsing by category
* Product detail pages
* Wishlist / favourites system
* Cart & checkout functionality
* Saved addresses management
* Order placement & tracking
* Customer profile dashboard
* Real-time order status updates
* Notification panel
* Responsive premium UI

---

## 🛠 Admin Features

* Admin dashboard
* Product management (CRUD)
* Category management
* Homepage banner management
* Featured product management
* Order management
* Order status updates
* Metal rate management
* Customer notifications
* Revenue & sales overview
* Inventory management

---

# ⚙ Dynamic Jewellery Pricing Engine

The platform includes a custom pricing engine that calculates jewellery pricing dynamically using:

* Live metal rates
* Net weight
* Purity
* Making charges
* GST
* Stone charges

---

# 🔐 Authentication & Security

* JWT Authentication
* Role-based access control
* Secure password hashing
* Protected admin routes
* Customer authentication
* Persistent login sessions

---

# 🧰 Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Context API
* Lucide React Icons

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer

---

## Database

* MongoDB Atlas

---

## Deployment

* Render
* GitHub

---

# 🎨 UI/UX Design

The platform is inspired by luxury jewellery brands like:

* PNG Jewellers
* Tanishq
* Malabar Gold & Diamonds

Design Highlights:

* Luxury burgundy + gold theme
* Editorial layouts
* Premium spacing
* Soft shadows
* Elegant animations
* Responsive design
* Cinematic hero sections

---

# 📁 Project Structure

```bash
Vitthaldas-Singhal-Saraf-Jewellery-Retailer/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── server.js
│
├── README.md
└── package.json
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/AbhishekSethi2005/VITTHALDAS-SINGHAL-SARAF.git
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret

JWT_EXPIRE=15m

JWT_REFRESH_EXPIRE=7d

CLIENT_URL=http://localhost:5173
```

---

# ▶ Running the Project

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:5000
```

---

# 🌐 Deployment

The project is deployment-ready for:

* Render
* MongoDB Atlas
* GitHub

---

# 📦 Production Build

Frontend production build:

```bash
cd client
npm run build
```

---

# 🧪 Seed Database

Run database seeding:

```bash
npm run seed
```

This automatically creates:

* Admin user
* Categories
* Products
* Notifications
* Sample banners
* Metal rates

---

# 👑 Admin Features

## Admin Dashboard Includes

* Revenue analytics
* Order management
* Product management
* Featured products
* Inventory tracking
* Notifications system
* Customer management

---

# 🛒 Customer Features

## Customer Dashboard Includes

* Order history
* Wishlist
* Saved addresses
* Notifications
* Profile management
* Checkout system

---

# 📸 Key Functionalities

## Wishlist System

* Add/remove favourites
* Persistent wishlist
* Product image previews

---

## Notification System

* Order status notifications
* Featured product notifications
* Price update notifications

---

## Order Tracking

Order statuses:

* Pending
* Confirmed
* Processing
* Shipped
* Delivered
* Cancelled

---

# 🔮 Future Improvements

* Razorpay integration
* Cloudinary image uploads
* Invoice generation
* Email notifications
* SMS notifications
* Advanced analytics
* AI jewellery recommendations

---

# 👨‍💻 Developed By

**Abhishek Anand Sethi**

B.Tech IT Student
Full Stack Developer | AI/ML Enthusiast

GitHub:
[https://github.com/AbhishekSethi2005](https://github.com/AbhishekSethi2005)

---

# 📄 License

This project is developed for educational and portfolio purposes.
