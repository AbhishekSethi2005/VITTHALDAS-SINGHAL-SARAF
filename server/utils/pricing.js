const { getRatePerGram } = require('../services/metalRateService');

/**
 * Calculate the price of a jewellery item dynamically.
 * Formula: (netWeight × metalRate) + makingCharges + stoneCharges
 */
const calculateProductPrice = async (product) => {
  if (product.pricingType === 'fixed' && product.fixedPrice) {
    const fixedPricing = {
      basePrice: product.fixedPrice,
      metalRate: 0,
      makingCharges: 0,
      stoneCharges: product.stoneCharges || 0,
      totalBeforeTax: product.fixedPrice,
    };
    if (product.variants && product.variants.length > 0) {
      fixedPricing.variants = product.variants.map(v => ({ variantId: v._id, ...fixedPricing }));
    }
    return fixedPricing;
  }

  const ratePerGram = await getRatePerGram(product.metalType, product.purity);
  const metalRate = ratePerGram * 10;
  const stoneCharges = product.stoneCharges || 0;

  const calcForWeight = (weight) => {
    if (!weight) return null;
    const metalValue = weight * ratePerGram;
    let makingCharges = 0;
    if (product.makingChargeType === 'flat') {
      makingCharges = product.makingCharges || 0;
    } else if (product.makingChargeType === 'percentage') {
      makingCharges = (metalValue * (product.makingCharges || 0)) / 100;
    } else if (product.makingChargeType === 'per_gram') {
      makingCharges = (product.makingCharges || 0) * weight;
    }
    const totalBeforeTax = metalValue + makingCharges + stoneCharges;
    return {
      basePrice: Math.round(metalValue),
      metalRate: metalRate,
      ratePerGram: Math.round(ratePerGram),
      makingCharges: Math.round(makingCharges),
      stoneCharges: Math.round(stoneCharges),
      totalBeforeTax: Math.round(totalBeforeTax),
    };
  };

  const defaultPricing = calcForWeight(product.netWeight) || {
    basePrice: 0, metalRate, ratePerGram, makingCharges: 0, stoneCharges, totalBeforeTax: 0
  };

  // Calculate for variants if they exist
  if (product.variants && product.variants.length > 0) {
    defaultPricing.variants = product.variants.map(v => ({
      variantId: v._id,
      size: v.size,
      weight: v.netWeight,
      pricing: calcForWeight(v.netWeight) || defaultPricing
    }));
  }

  return defaultPricing;
};

/**
 * Calculate cart total with tax
 */
const calculateCartTotal = (items, gstRate = 3) => {
  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const taxAmount = Math.round((subtotal * gstRate) / 100);
  const total = subtotal + taxAmount;

  return {
    subtotal,
    taxRate: gstRate,
    taxAmount,
    total,
  };
};

module.exports = { calculateProductPrice, calculateCartTotal };
