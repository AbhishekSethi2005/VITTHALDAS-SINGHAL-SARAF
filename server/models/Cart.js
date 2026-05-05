const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Unique constraint: one product per user (upsert increments quantity instead)
cartItemSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
