const Order = require('../models/Order');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const { calculateProductPrice, calculateCartTotal } = require('../utils/pricing');

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    const settings = await Settings.getSettings();

    // Build order items with current prices
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product).lean();
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found.` });
      }

      const pricing = await calculateProductPrice(product);

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        quantity: item.quantity || 1,
        metalType: product.metalType,
        purity: product.purity,
        weight: product.netWeight,
        metalRate: pricing.metalRate,
        makingCharges: pricing.makingCharges,
        stoneCharges: pricing.stoneCharges,
        itemPrice: pricing.totalBeforeTax,
      });
    }

    // Calculate totals
    const { subtotal, taxRate, taxAmount, total } = calculateCartTotal(
      orderItems,
      settings.gstRate
    );

    // Shipping
    const shippingCharges =
      subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCharges;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      taxRate,
      taxAmount,
      shippingCharges,
      totalAmount: total + shippingCharges,
      paymentMethod,
      notes,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    // Update product sold counts
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { soldCount: item.quantity },
      });
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });

    if (status === 'confirmed' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'pending';
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard stats (Admin)
// @route   GET /api/orders/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      totalUsers,
      recentOrders,
      popularProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      require('../models/User').countDocuments({ role: 'customer' }),
      Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5).lean(),
      Product.find().sort({ soldCount: -1 }).limit(5).lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        deliveredOrders,
        totalUsers,
        recentOrders,
        popularProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
