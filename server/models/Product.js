const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    metalType: {
      type: String,
      enum: ['gold', 'silver', 'platinum', 'other'],
      required: true,
    },
    purity: {
      type: String,
      enum: ['24K', '22K', '18K', '14K', '999', '925', '916', 'other'],
      required: true,
    },
    grossWeight: {
      type: Number,
      min: 0,
    },
    netWeight: {
      type: Number,
      min: 0,
    },
    // Variants (e.g., Size 12 with 4.5g weight)
    variants: [
      {
        size: String,
        grossWeight: Number,
        netWeight: Number,
        sku: String,
        stock: { type: Number, default: 1 },
      }
    ],
    // Pricing
    pricingType: {
      type: String,
      enum: ['dynamic', 'fixed'],
      default: 'dynamic',
    },
    fixedPrice: {
      type: Number,
      min: 0,
    },
    makingCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    makingChargeType: {
      type: String,
      enum: ['flat', 'percentage', 'per_gram'],
      default: 'per_gram',
    },
    stoneCharges: {
      type: Number,
      default: 0,
    },
    // Images
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
      },
    ],
    // Product details
    sku: {
      type: String,
      unique: true,
    },
    tags: [String],
    occasion: [
      {
        type: String,
        enum: ['wedding', 'daily-wear', 'festive', 'engagement', 'gift', 'office'],
      },
    ],
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'kids'],
      default: 'women',
    },
    // Status
    inStock: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Analytics
    views: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Auto-generate slug with collision handling
productSchema.pre('save', async function () {
  if (this.isModified('name')) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    // Check for existing slugs (excluding this document if updating)
    const Product = this.constructor;
    while (true) {
      const existing = await Product.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  // Auto-generate SKU if not set
  if (!this.sku) {
    const prefix = this.metalType === 'gold' ? 'GLD' : this.metalType === 'silver' ? 'SLV' : 'PLT';
    this.sku = `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  }
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, metalType: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
