import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import api from '../../utils/api';
import { formatRate } from '../../utils/helpers';

export default function LiveRates() {
  const [rates, setRates] = useState(null);
  const [previousRates, setPreviousRates] = useState(null);

  useEffect(() => {
    api.get('/settings/public')
      .then(({ data }) => {
        setRates(data.data.metalRates);
        setPreviousRates(data.data.previousRates || null);
      })
      .catch(() => {
        setRates({
          gold24K: 72000, gold22K: 66000, gold18K: 54000,
          silver999: 85000, silver925: 78000,
          lastUpdated: new Date().toISOString(),
        });
      });
  }, []);

  if (!rates) return null;

  const getTrend = (key) => {
    if (!previousRates || !previousRates[key]) return 'neutral';
    if (rates[key] > previousRates[key]) return 'up';
    if (rates[key] < previousRates[key]) return 'down';
    return 'neutral';
  };

  const getDiff = (key) => {
    if (!previousRates || !previousRates[key]) return 0;
    return rates[key] - previousRates[key];
  };

  const rateItems = [
    { key: 'gold24K', label: 'Gold 24K', value: rates.gold24K, unit: '10g', isPrimary: true },
    { key: 'gold22K', label: 'Gold 22K', value: rates.gold22K, unit: '10g', isPrimary: true },
    { key: 'gold18K', label: 'Gold 18K', value: rates.gold18K, unit: '10g', isPrimary: false },
    { key: 'silver999', label: 'Silver 999', value: rates.silver999, unit: '1kg', isPrimary: false },
  ];

  return (
    <div className="bg-brand-dark relative z-20 border-b border-white/5">
      {/* Gold accent line on top */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-3">

          {/* Live indicator */}
          <div className="flex items-center gap-3 text-brand-gold-light shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Live Rates</span>
          </div>

          {/* Rate items */}
          <div className="flex flex-wrap justify-evenly flex-1 px-2 w-full">
            {rateItems.map((item) => {
              const trend = getTrend(item.key);
              const diff = getDiff(item.key);
              return (
                <div
                  key={item.key}
                  className={`group relative flex items-center justify-center gap-2.5 px-2 py-2 flex-1 rounded-md cursor-default transition-all duration-300 hover:bg-white/[0.06] ${
                    item.isPrimary ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400 group-hover:text-brand-gold-light transition-colors font-medium mb-0.5">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-heading font-bold text-base tracking-wide">
                          ₹{formatRate(item.value)}
                        </span>
                        <span className="text-[10px] text-gray-500">/{item.unit}</span>
                      </div>
                      
                      {/* Trend indicator vertically centered with price text */}
                      <div className={`flex items-center gap-1 ${
                        trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'
                      }`}>
                        {trend === 'up' && <TrendingUp size={14} />}
                        {trend === 'down' && <TrendingDown size={14} />}
                        {trend === 'neutral' && <Minus size={14} />}
                        {diff !== 0 && (
                          <span className="text-[11px] font-bold">
                            {diff > 0 ? '+' : ''}{formatRate(diff)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover gold accent */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-brand-gold rounded-full transition-all duration-300 group-hover:w-3/4" />
                </div>
              );
            })}
          </div>

          {/* Last updated */}
          <div className="hidden lg:flex items-center gap-1.5 text-[9px] text-gray-500 uppercase tracking-[0.15em] font-medium shrink-0">
            <Clock size={11} className="text-gray-600" />
            {new Date(rates.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>

        </div>
      </div>
    </div>
  );
}
