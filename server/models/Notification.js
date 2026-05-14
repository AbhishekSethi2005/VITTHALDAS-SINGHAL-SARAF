const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // if null, it's a global notification (for all customers)
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['order', 'product', 'system', 'price'],
      default: 'system',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    link: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
