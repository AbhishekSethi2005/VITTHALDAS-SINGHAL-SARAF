const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  metalType: String,
  purity: String,
  weight: Number,
  metalRate: Number,
  makingCharges: Number,
  stoneCharges: Number,
  itemPrice: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    // Pricing breakdown
    subtotal: {
      type: Number,
      required: true,
    },
    taxRate: {
      type: Number,
      default: 3, // GST 3% on jewellery
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // Payment
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'bank_transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    // Order status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = 'VSS';
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.orderNumber = `${prefix}-${dateStr}-${random}`;
  }
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
