/**
 * Metal Rate Service
 * Centralises metal rate lookups so pricing logic doesn't scatter DB calls.
 */
const Settings = require('../models/Settings');

/**
 * Returns the metal rates object from the singleton Settings document.
 * @returns {Promise<Object>} metalRates
 */
const getMetalRates = async () => {
  const settings = await Settings.getSettings();
  return settings.metalRates;
};

/**
 * Returns the per-gram rate for a given metalType + purity combination.
 * @param {string} metalType - 'gold' | 'silver' | 'platinum'
 * @param {string} purity    - '24K' | '22K' | '18K' | '916' | '999' | '925' | ...
 * @returns {Promise<number>} rate per gram in INR
 */
const getRatePerGram = async (metalType, purity) => {
  const rates = await getMetalRates();

  let metalRate = 0;
  if (metalType === 'gold') {
    if (purity === '24K') metalRate = rates.gold24K;
    else if (purity === '22K' || purity === '916') metalRate = rates.gold22K;
    else if (purity === '18K') metalRate = rates.gold18K;
    else metalRate = rates.gold22K; // fallback
  } else if (metalType === 'silver') {
    if (purity === '999') metalRate = rates.silver999;
    else if (purity === '925') metalRate = rates.silver925;
    else metalRate = rates.silver999; // fallback
  } else if (metalType === 'platinum') {
    metalRate = rates.platinum;
  }

  return metalRate / 10; // rates are stored per 10g
};

/**
 * Update metal rates and archive current as previous for trend tracking.
 * @param {Object} newRates - Partial or full rates object
 * @returns {Promise<Object>} updated metalRates
 */
const updateMetalRates = async (newRates) => {
  const settings = await Settings.getSettings();
  const current = settings.metalRates;

  // Archive current rates
  settings.previousRates = { ...current };

  // Merge new rates
  settings.metalRates = {
    gold24K: Number(newRates.gold24K) || current.gold24K,
    gold22K: Number(newRates.gold22K) || current.gold22K,
    gold18K: Number(newRates.gold18K) || current.gold18K,
    silver999: Number(newRates.silver999) || current.silver999,
    silver925: Number(newRates.silver925) || current.silver925,
    platinum: Number(newRates.platinum) || current.platinum,
    lastUpdated: new Date(),
  };

  await settings.save();
  return settings.metalRates;
};

module.exports = { getMetalRates, getRatePerGram, updateMetalRates };
