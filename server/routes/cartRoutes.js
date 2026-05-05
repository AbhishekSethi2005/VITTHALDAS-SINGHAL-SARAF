const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

// ALL cart routes require authentication
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.patch('/:itemId', protect, updateCartItem);
router.delete('/:itemId', protect, removeCartItem);
router.delete('/', protect, clearCart);

module.exports = router;
