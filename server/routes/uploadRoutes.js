const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// @desc    Upload single image
// @route   POST /api/upload
// @access  Admin
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file provided.' });
      }

      const folder = req.body.folder || 'vss/products';
      const result = await uploadToCloudinary(req.file.buffer, folder);

      res.status(201).json({
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Upload multiple images (max 6)
// @route   POST /api/upload/multiple
// @access  Admin
router.post(
  '/multiple',
  protect,
  adminOnly,
  upload.array('images', 6),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No images provided.' });
      }

      const folder = req.body.folder || 'vss/products';
      const uploads = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, folder))
      );

      res.status(201).json({
        success: true,
        data: uploads,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload
// @access  Admin
router.delete(
  '/',
  protect,
  adminOnly,
  async (req, res, next) => {
    try {
      const { publicId } = req.body;
      if (!publicId) {
        return res.status(400).json({ success: false, message: 'publicId is required.' });
      }

      await deleteFromCloudinary(publicId);
      res.json({ success: true, message: 'Image deleted.' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
