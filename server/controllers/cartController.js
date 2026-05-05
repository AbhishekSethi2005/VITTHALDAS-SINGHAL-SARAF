const CartItem = require('../models/Cart');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const { calculateProductPrice } = require('../utils/pricing');

// ─── Helper: build fully-priced cart response ───
const buildCartResponse = async (userId) => {
  const cartItems = await CartItem.find({ user: userId })
    .populate({
      path: 'product',
      select: 'name slug images metalType purity netWeight pricingType fixedPrice makingCharges makingChargeType stoneCharges variants isActive inStock',
      populate: { path: 'category', select: 'name slug' },
    })
    .sort({ addedAt: 1 })
    .lean();

  const settings = await Settings.getSettings();
  const pricedItems = [];

  for (const item of cartItems) {
    if (!item.product || !item.product.isActive) continue; // skip deleted/inactive

    const pricing = await calculateProductPrice(item.product);
    const itemPrice = pricing.totalBeforeTax || 0;

    pricedItems.push({
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.images?.[0]?.url || '',
        metalType: item.product.metalType,
        purity: item.product.purity,
        netWeight: item.product.netWeight,
        inStock: item.product.inStock,
      },
      quantity: item.quantity,
      price: itemPrice,
      pricing,
      addedAt: item.addedAt,
    });
  }

  // Totals
  const subtotal = pricedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxRate = settings.gstRate || 3;
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const shippingCharges =
    subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCharges || 0;
  const total = subtotal + taxAmount + shippingCharges;

  return {
    items: pricedItems,
    itemCount: pricedItems.length,
    subtotal,
    taxRate,
    taxAmount,
    shippingCharges,
    freeShippingThreshold: settings.freeShippingThreshold,
    total,
  };
};

// ─── GET /api/cart — Fetch current user's cart ───
exports.getCart = async (req, res, next) => {
  try {
    const cart = await buildCartResponse(req.user._id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/cart — Add item to cart ───
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required.' });
    }

    // Verify product exists and is active
    const product = await Product.findById(productId).lean();
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable.' });
    }

    // Upsert: if product already in cart, increment quantity
    const existing = await CartItem.findOne({ user: req.user._id, product: productId });
    if (existing) {
      existing.quantity += Math.max(1, parseInt(quantity) || 1);
      await existing.save();
    } else {
      await CartItem.create({
        user: req.user._id,
        product: productId,
        quantity: Math.max(1, parseInt(quantity) || 1),
      });
    }

    const cart = await buildCartResponse(req.user._id);
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/cart/:itemId — Update quantity ───
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const parsedQty = parseInt(quantity);

    if (!Number.isFinite(parsedQty) || parsedQty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }

    // Find item AND verify ownership (prevent IDOR)
    const item = await CartItem.findOne({ _id: req.params.itemId, user: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    item.quantity = parsedQty;
    await item.save();

    const cart = await buildCartResponse(req.user._id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart/:itemId — Remove single item ───
exports.removeCartItem = async (req, res, next) => {
  try {
    // Verify ownership before deleting
    const item = await CartItem.findOneAndDelete({ _id: req.params.itemId, user: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    const cart = await buildCartResponse(req.user._id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart — Clear entire cart ───
exports.clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({
      success: true,
      data: {
        items: [],
        itemCount: 0,
        subtotal: 0,
        taxRate: 3,
        taxAmount: 0,
        shippingCharges: 0,
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Export helper for use in order controller
exports.buildCartResponse = buildCartResponse;
