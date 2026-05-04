const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Settings = require('../models/Settings');

// @desc    Get current metal rates (public)
// @route   GET /api/metal-rates
router.get('/', async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    const { metalRates, previousRates } = settings;

    const buildTrend = (key) => {
      if (!previousRates || !previousRates[key]) return 'neutral';
      if (metalRates[key] > previousRates[key]) return 'up';
      if (metalRates[key] < previousRates[key]) return 'down';
      return 'neutral';
    };

    res.json({
      success: true,
      data: {
        gold24K: metalRates.gold24K,
        gold22K: metalRates.gold22K,
        gold18K: metalRates.gold18K,
        silver999: metalRates.silver999,
        silver925: metalRates.silver925,
        platinum: metalRates.platinum,
        lastUpdated: metalRates.lastUpdated,
        trends: {
          gold24K: buildTrend('gold24K'),
          gold22K: buildTrend('gold22K'),
          gold18K: buildTrend('gold18K'),
          silver999: buildTrend('silver999'),
          silver925: buildTrend('silver925'),
          platinum: buildTrend('platinum'),
        },
        changes: {
          gold24K: metalRates.gold24K - (previousRates?.gold24K || metalRates.gold24K),
          gold22K: metalRates.gold22K - (previousRates?.gold22K || metalRates.gold22K),
          gold18K: metalRates.gold18K - (previousRates?.gold18K || metalRates.gold18K),
          silver999: metalRates.silver999 - (previousRates?.silver999 || metalRates.silver999),
          silver925: metalRates.silver925 - (previousRates?.silver925 || metalRates.silver925),
          platinum: metalRates.platinum - (previousRates?.platinum || metalRates.platinum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update metal rates (Admin)
// @route   PUT /api/metal-rates
router.put('/', protect, adminOnly, async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    const current = settings.metalRates;

    // Archive previous rates for trend tracking
    settings.previousRates = {
      gold24K: current.gold24K,
      gold22K: current.gold22K,
      gold18K: current.gold18K,
      silver999: current.silver999,
      silver925: current.silver925,
      platinum: current.platinum,
    };

    // Update with new rates (only override provided fields)
    settings.metalRates = {
      gold24K: Number(req.body.gold24K) || current.gold24K,
      gold22K: Number(req.body.gold22K) || current.gold22K,
      gold18K: Number(req.body.gold18K) || current.gold18K,
      silver999: Number(req.body.silver999) || current.silver999,
      silver925: Number(req.body.silver925) || current.silver925,
      platinum: Number(req.body.platinum) || current.platinum,
      lastUpdated: new Date(),
    };

    await settings.save();

    res.json({ success: true, data: settings.metalRates, message: 'Rates updated successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
