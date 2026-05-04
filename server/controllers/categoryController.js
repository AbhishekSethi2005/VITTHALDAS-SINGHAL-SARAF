const Category = require('../models/Category');

// @desc    Get all categories (public)
// @route   GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:slug
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      $or: [{ slug: req.params.slug }, { _id: req.params.slug }],
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

// @desc    Create category
// @route   POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
};
