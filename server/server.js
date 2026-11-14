require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Enable CDNs, Google Fonts, Razorpay and Unsplash image loaders
}));
app.use(cors({
  origin: process.env.CLIENT_URL || true, // Seamlessly adapt to dynamic deployment URLs
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Ensure database connection is ready for incoming requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);

// /api/metal-rates — public alias for metal rates (spec requirement)
const metalRatesRouter = require('./routes/metalRatesRoutes');
app.use('/api/metal-rates', metalRatesRouter);

const fs = require('fs');
const path = require('path');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'alive', timestamp: new Date() });
});

// Serve static files and act as client host router in Production Mode if client build exists
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  // All requests that don't match API routes serve the React index layout
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(clientDist, 'index.html'));
  });
} else {
  // Base route for local backend dev testing or standalone API service
  app.get('/', (req, res) => {
    res.send('Vitthaldas Singhal Saraf API is running...');
  });
  // Return JSON 404 for unhandled API routes when running as a standalone service
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });
}

// Custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Wait for MongoDB Connection before starting Server
connectDB()
  .then(() => {
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 [Server] Running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}\n`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ Critical Boot Error:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  });

module.exports = app;

