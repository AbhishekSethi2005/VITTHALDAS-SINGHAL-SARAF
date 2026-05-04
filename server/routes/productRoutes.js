const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  getAdminProduct,
} = require('../controllers/productController');

// Admin routes — MUST be before /:slug to avoid being caught by wildcard
router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.get('/admin/:id', protect, adminOnly, getAdminProduct);

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProduct);

// Admin CRUD
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
