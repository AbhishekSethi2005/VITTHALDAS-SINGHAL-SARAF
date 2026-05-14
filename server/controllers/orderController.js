const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const CartItem = require('../models/Cart');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');
const { calculateProductPrice, calculateCartTotal } = require('../utils/pricing');

// ─── Razorpay instance ───
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Helper: build order items from DB cart (NEVER trust frontend prices) ───
const buildOrderFromCart = async (userId) => {
  const cartItems = await CartItem.find({ user: userId })
    .populate('product')
    .lean();

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const settings = await Settings.getSettings();
  const orderItems = [];

  for (const item of cartItems) {
    if (!item.product || !item.product.isActive) continue;

    const pricing = await calculateProductPrice(item.product);

    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0]?.url || '',
      quantity: item.quantity,
      metalType: item.product.metalType,
      purity: item.product.purity,
      weight: item.product.netWeight,
      metalRate: pricing.metalRate,
      makingCharges: pricing.makingCharges,
      stoneCharges: pricing.stoneCharges,
      itemPrice: pricing.totalBeforeTax,
    });
  }

  const { subtotal, taxRate, taxAmount, total } = calculateCartTotal(
    orderItems,
    settings.gstRate
  );

  const shippingCharges =
    subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCharges;

  return {
    orderItems,
    subtotal,
    taxRate,
    taxAmount,
    shippingCharges,
    totalAmount: total + shippingCharges,
  };
};

// ─── POST /api/orders/create-razorpay-order ───
// Creates a Razorpay order from the user's DB cart
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { shippingAddress, deliveryType, notes } = req.body;

    // Build order from DB cart — server-side price calculation
    const cartData = await buildOrderFromCart(req.user._id);
    if (!cartData) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    // Validate shipping address for home delivery
    if (deliveryType !== 'store_pickup') {
      if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
          !shippingAddress.addressLine1 || !shippingAddress.city ||
          !shippingAddress.state || !shippingAddress.pincode) {
        return res.status(400).json({ success: false, message: 'Complete shipping address is required.' });
      }
      // Validate phone
      if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
      }
    }

    const amountInPaise = Math.round(cartData.totalAmount * 100);

    if (!amountInPaise || amountInPaise < 100) {
      return res.status(400).json({ success: false, message: 'Order amount is too low. Minimum is ₹1.' });
    }

    // Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${req.user._id}_${Date.now()}`.substring(0, 40),
        notes: {
          userId: req.user._id.toString(),
          deliveryType: deliveryType || 'home_delivery',
        },
      });
    } catch (rpError) {
      console.error('Razorpay order creation failed:', rpError?.error || rpError?.message || rpError);
      const msg = rpError?.error?.description || rpError?.message || 'Payment gateway error. Please try again.';
      return res.status(502).json({ success: false, message: msg });
    }

    // Store order intent in a pending order
    const pendingAddress = deliveryType === 'store_pickup'
      ? {
          fullName: req.user.name,
          phone: req.user.phone || '0000000000',
          addressLine1: 'Sarafa Bazar, Lashkar',
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          pincode: '474001',
        }
      : shippingAddress;

    const order = await Order.create({
      user: req.user._id,
      items: cartData.orderItems,
      shippingAddress: pendingAddress,
      subtotal: cartData.subtotal,
      taxRate: cartData.taxRate,
      taxAmount: cartData.taxAmount,
      shippingCharges: cartData.shippingCharges,
      totalAmount: cartData.totalAmount,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      status: 'pending',
      razorpayOrderId: razorpayOrder.id,
      notes: notes || (deliveryType === 'store_pickup' ? 'Store Pickup' : ''),
      statusHistory: [{ status: 'pending', note: 'Order created, awaiting payment' }],
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        prefill: {
          name: req.user.name,
          email: req.user.email,
          contact: req.user.phone || '',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/orders/verify-payment ───
// Verify Razorpay payment signature and finalize order
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification data missing.' });
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Payment verification failed — mark order as failed
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'failed',
          $push: { statusHistory: { status: 'pending', note: 'Payment verification failed' } },
        });
      }
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Payment is valid — finalize order
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id, // SECURITY: verify ownership
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Update order to confirmed + paid
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.status = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment received via Razorpay' });
    await order.save();

    // Clear user's cart from DB
    await CartItem.deleteMany({ user: req.user._id });

    // Update product sold counts
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { soldCount: item.quantity },
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/orders — legacy create (kept for backward compat) ───
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    const cartData = await buildOrderFromCart(req.user._id);
    if (!cartData) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    const order = await Order.create({
      user: req.user._id,
      items: cartData.orderItems,
      shippingAddress,
      subtotal: cartData.subtotal,
      taxRate: cartData.taxRate,
      taxAmount: cartData.taxAmount,
      shippingCharges: cartData.shippingCharges,
      totalAmount: cartData.totalAmount,
      paymentMethod: paymentMethod || 'cod',
      notes,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    // Clear cart
    await CartItem.deleteMany({ user: req.user._id });

    // Update sold counts
    for (const item of cartData.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { soldCount: item.quantity },
      });
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/my-orders ───
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

// ─── GET /api/orders/:id ───
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check ownership or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ============ ADMIN ============

// ─── GET /api/orders/admin/all ───
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

// ─── PUT /api/orders/:id/status ───
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

    // Create notification for customer
    await Notification.create({
      user: order.user,
      title: 'Order Status Updated',
      message: `Your order #${order.orderNumber || order._id.toString().slice(-6).toUpperCase()} has been ${status}.`,
      type: 'order',
      link: '/profile?tab=orders'
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/admin/stats ───
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
