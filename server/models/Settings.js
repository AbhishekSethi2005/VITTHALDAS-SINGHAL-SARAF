const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    // Metal rates
    metalRates: {
      gold24K: { type: Number, default: 72000 },
      gold22K: { type: Number, default: 66000 },
      gold18K: { type: Number, default: 54000 },
      silver999: { type: Number, default: 85000 },
      silver925: { type: Number, default: 78000 },
      platinum: { type: Number, default: 95000 },
      lastUpdated: { type: Date, default: Date.now },
    },
    // Previous rates for trend comparison
    previousRates: {
      gold24K: { type: Number, default: 72000 },
      gold22K: { type: Number, default: 66000 },
      gold18K: { type: Number, default: 54000 },
      silver999: { type: Number, default: 85000 },
      silver925: { type: Number, default: 78000 },
      platinum: { type: Number, default: 95000 },
    },
    // Tax
    gstRate: {
      type: Number,
      default: 3,
    },
    // Business info
    businessInfo: {
      phone: { type: String, default: '+91-XXXXXXXXXX' },
      whatsapp: { type: String, default: '+91-XXXXXXXXXX' },
      email: { type: String, default: 'info@vssaraf.com' },
      address: {
        type: String,
        default: 'Sarafa Bazar, Lashkar, Gwalior, Madhya Pradesh, India',
      },
      mapEmbedUrl: String,
    },
    // Banners
    banners: [
      {
        title: String,
        subtitle: String,
        image: {
          url: String,
          publicId: String,
        },
        link: String,
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    // Offers
    offers: [
      {
        title: String,
        description: String,
        discount: Number,
        validTill: Date,
        isActive: { type: Boolean, default: true },
      },
    ],
    // Shipping
    freeShippingThreshold: {
      type: Number,
      default: 50000,
    },
    shippingCharges: {
      type: Number,
      default: 500,
    },
  },
  { timestamps: true }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
