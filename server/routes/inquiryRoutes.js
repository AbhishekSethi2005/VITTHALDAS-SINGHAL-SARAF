const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');

// Public — anyone can submit an inquiry
router.post('/', createInquiry);

// Admin routes
router.get('/', protect, adminOnly, getInquiries);
router.put('/:id', protect, adminOnly, updateInquiry);
router.delete('/:id', protect, adminOnly, deleteInquiry);

module.exports = router;
