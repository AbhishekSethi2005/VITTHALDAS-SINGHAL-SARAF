import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import api from '../../utils/api';
import { formatRate } from '../../utils/helpers';

const fallbackRates = {
  gold24K: 156000,
  gold22K: 149999,
  gold18K: 144000,
  silver999: 285000,
};

export default function LiveRates() {
  const [rates, setRates] = useState(fallbackRates);

  useEffect(() => {
    let mounted = true;

    api
      .get('/settings/public')
      .then(({ data }) => {
        const metalRates = data?.data?.metalRates || data?.metalRates;
        if (mounted && metalRates) setRates({ ...fallbackRates, ...metalRates });
      })
      .catch(() => {
        if (mounted) setRates(fallbackRates);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const items = [
    { label: 'GOLD 24K', value: rates.gold24K, unit: '10g' },
    { label: 'GOLD 22K', value: rates.gold22K, unit: '10g' },
    { label: 'GOLD 18K', value: rates.gold18K, unit: '10g' },
    { label: 'SILVER 999', value: rates.silver999, unit: '1kg' },
  ];

  return (
    <section className="border-y border-[#D4AF37]/25 bg-[#0E0E0E] text-white">
      <div className="section-container">
        <div className="grid min-h-[64px] items-center gap-4 py-3 lg:grid-cols-[160px_1fr_120px]">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
            LIVE RATES
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:divide-x lg:divide-white/10">
            {items.map((item) => (
              <div key={item.label} className="px-0 text-center lg:px-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4AF37]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-bold sm:text-base">
                  Rs. {formatRate(item.value)}
                  <span className="ml-1 font-normal text-white/50">/{item.unit}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-start gap-2 text-[11px] font-medium text-white/75 lg:justify-end">
            <Clock size={14} className="text-[#D4AF37]" />
            10:58 AM
          </div>
        </div>
      </div>
    </section>
  );
}
