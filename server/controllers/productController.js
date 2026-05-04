const Product = require('../models/Product');
const { calculateProductPrice } = require('../utils/pricing');

// @desc    Get all products (public, with filters)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      metalType,
      purity,
      gender,
      occasion,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (metalType) query.metalType = metalType;
    if (purity) query.purity = purity;
    if (gender) query.gender = gender;
    if (occasion) query.occasion = { $in: occasion.split(',') };
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortObj = {};
    if (sort === 'price_asc') sortObj = { netWeight: 1 };
    else if (sort === 'price_desc') sortObj = { netWeight: -1 };
    else if (sort === 'popular') sortObj = { soldCount: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else sortObj = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    // Calculate prices for all products
    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const pricing = await calculateProductPrice(product);
        return { ...product, pricing };
      })
    );

    // Filter by price range if specified
    let filteredProducts = productsWithPrices;
    if (minPrice || maxPrice) {
      filteredProducts = productsWithPrices.filter((p) => {
        const price = p.pricing.totalBeforeTax;
        if (minPrice && price < parseInt(minPrice)) return false;
        if (maxPrice && price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: filteredProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:slug
exports.getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const mongoose = require('mongoose');
    const query = { isActive: true };
    
    if (mongoose.Types.ObjectId.isValid(slug)) {
      query.$or = [{ slug: slug }, { _id: slug }];
    } else {
      query.slug = slug;
    }

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Increment views
    await Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } });

    const pricing = await calculateProductPrice(product);

    // Get related products
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean();

    const relatedWithPrices = await Promise.all(
      related.map(async (p) => {
        const rPricing = await calculateProductPrice(p);
        return { ...p, pricing: rPricing };
      })
    );

    res.json({
      success: true,
      data: { ...product, pricing, relatedProducts: relatedWithPrices },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .lean();

    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const pricing = await calculateProductPrice(product);
        return { ...product, pricing };
      })
    );

    res.json({ success: true, data: productsWithPrices });
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

// @desc    Create product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin (including inactive)
// @route   GET /api/products/admin/all
exports.getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const pricing = await calculateProductPrice(product);
        return { ...product, pricing };
      })
    );

    res.json({
      success: true,
      data: productsWithPrices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product for admin (including inactive, by ID)
// @route   GET /api/products/admin/:id
exports.getAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const pricing = await calculateProductPrice(product);
    res.json({ success: true, data: { ...product, pricing } });
  } catch (error) {
    next(error);
  }
};
