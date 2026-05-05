const Settings = require('../models/Settings');

exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: {
        metalRates: settings.metalRates,
        previousRates: settings.previousRates,
        businessInfo: settings.businessInfo,
        banners: settings.banners.filter((b) => b.isActive),
        offers: settings.offers.filter((o) => o.isActive),
        gstRate: settings.gstRate,
        freeShippingThreshold: settings.freeShippingThreshold,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

exports.updateRates = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    // Save current rates as previous before updating
    const currentRates = settings.metalRates;
    settings.previousRates = {
      gold24K: currentRates.gold24K,
      gold22K: currentRates.gold22K,
      gold18K: currentRates.gold18K,
      silver999: currentRates.silver999,
      silver925: currentRates.silver925,
      platinum: currentRates.platinum,
    };
    const rate = (val, fallback) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };
    settings.metalRates = {
      gold24K: rate(req.body.gold24K, currentRates.gold24K),
      gold22K: rate(req.body.gold22K, currentRates.gold22K),
      gold18K: rate(req.body.gold18K, currentRates.gold18K),
      silver999: rate(req.body.silver999, currentRates.silver999),
      silver925: rate(req.body.silver925, currentRates.silver925),
      platinum: rate(req.body.platinum, currentRates.platinum),
      lastUpdated: new Date(),
    };
    await settings.save();
    res.json({ success: true, data: settings.metalRates });
  } catch (error) {
    next(error);
  }
};

exports.updateBusinessInfo = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    const bi = settings.businessInfo;
    settings.businessInfo = {
      phone: req.body.phone !== undefined ? req.body.phone : bi.phone,
      whatsapp: req.body.whatsapp !== undefined ? req.body.whatsapp : bi.whatsapp,
      email: req.body.email !== undefined ? req.body.email : bi.email,
      address: req.body.address !== undefined ? req.body.address : bi.address,
      mapEmbedUrl: req.body.mapEmbedUrl !== undefined ? req.body.mapEmbedUrl : bi.mapEmbedUrl,
    };
    await settings.save();
    res.json({ success: true, data: settings.businessInfo });
  } catch (error) {
    next(error);
  }
};

exports.updateBanners = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    settings.banners = req.body.banners;
    await settings.save();
    res.json({ success: true, data: settings.banners });
  } catch (error) {
    next(error);
  }
};

exports.addBanner = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    settings.banners.push(req.body);
    await settings.save();
    res.status(201).json({ success: true, data: settings.banners });
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    settings.banners = settings.banners.filter((b) => b._id.toString() !== req.params.bannerId);
    await settings.save();
    res.json({ success: true, data: settings.banners });
  } catch (error) {
    next(error);
  }
};
