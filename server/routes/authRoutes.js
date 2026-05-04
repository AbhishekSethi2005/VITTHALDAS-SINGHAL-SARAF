const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  toggleWishlist,
  logout,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
