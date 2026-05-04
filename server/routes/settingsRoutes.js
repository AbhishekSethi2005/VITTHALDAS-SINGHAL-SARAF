const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getPublicSettings,
  getSettings,
  updateRates,
  updateBusinessInfo,
  updateBanners,
  addBanner,
  deleteBanner,
} = require('../controllers/settingsController');

// Public routes
router.get('/public', getPublicSettings);

// Admin routes
router.get('/', protect, adminOnly, getSettings);
router.put('/rates', protect, adminOnly, updateRates);
router.put('/business', protect, adminOnly, updateBusinessInfo);
router.put('/banners', protect, adminOnly, updateBanners);
router.post('/banners', protect, adminOnly, addBanner);
router.delete('/banners/:bannerId', protect, adminOnly, deleteBanner);

module.exports = router;
