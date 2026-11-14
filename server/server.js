require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');

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

// Trust reverse proxy headers (required on Vercel for rate-limiting and client IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Enable CDNs, Google Fonts, Razorpay and Unsplash image loaders
}));

const allowedOrigins = [
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null,
  'https://vitthaldas-singhal-saraf-theta.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
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

// Health check endpoint (responds immediately, reports DB status)
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    status: 'alive',
    database: isDbConnected ? 'connected' : 'connecting_or_idle',
    timestamp: new Date(),
  });
});

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

// Base API status route
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Vitthaldas Singhal Saraf API is operational' });
});

// Serve static files and act as client host router in Production Mode if client build exists (standalone monolith mode only)
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist) && !process.env.VERCEL) {
  app.use(express.static(clientDist));

  // Catch-all non-API routes serve the React index layout
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(clientDist, 'index.html'));
  });
}

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Root fallback for direct API service root requests
app.get('/', (req, res) => {
  res.send('Vitthaldas Singhal Saraf API is running...');
});

// Catch-all 404 handler for any other unhandled routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// In standalone mode (non-Vercel), connect to DB and start HTTP server
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 [Server] Running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}\n`);
      });
    })
    .catch((err) => {
      console.error('❌ Critical Boot Error:', err.message);
    });
}

module.exports = app;

