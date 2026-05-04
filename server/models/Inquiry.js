const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: String,
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'resolved'],
      default: 'new',
    },
    adminNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
