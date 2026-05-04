import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminRates() {
  const [rates, setRates] = useState({ gold24K: 72000, gold22K: 66000, gold18K: 54000, silver999: 85000, silver925: 78000, platinum: 95000 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRates(); }, []);

  const fetchRates = () => {
    setLoading(true);
    api.get('/settings').then(({ data }) => {
      const r = data.data.metalRates;
      setRates({ gold24K: r.gold24K, gold22K: r.gold22K, gold18K: r.gold18K, silver999: r.silver999, silver925: r.silver925, platinum: r.platinum });
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    setSaving(true);
    try { await api.put('/settings/rates', rates); toast.success('Rates updated!'); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const fields = [
    { key: 'gold24K', label: 'Gold 24K', desc: 'Per 10g', color: 'border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400/20' },
    { key: 'gold22K', label: 'Gold 22K', desc: 'Per 10g', color: 'border-amber-200 focus:border-amber-400 focus:ring-amber-400/20' },
    { key: 'gold18K', label: 'Gold 18K', desc: 'Per 10g', color: 'border-orange-200 focus:border-orange-400 focus:ring-orange-400/20' },
    { key: 'silver999', label: 'Silver 999', desc: 'Per 1kg', color: 'border-gray-300 focus:border-gray-400 focus:ring-gray-400/20' },
    { key: 'silver925', label: 'Silver 925', desc: 'Per 1kg', color: 'border-slate-300 focus:border-slate-400 focus:ring-slate-400/20' },
    { key: 'platinum', label: 'Platinum', desc: 'Per 10g', color: 'border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400/20' },
  ];

  return (
    <>
      <Helmet><title>Metal Rates | Admin | VSS</title></Helmet>
      <AdminLayout title="Manage Metal Rates">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-xl font-heading font-medium text-brand-dark">Live Market Rates</h3>
              <p className="text-sm text-gray-500 mt-1">Changes reflect instantly across all product pricing.</p>
            </div>
            <button onClick={fetchRates} className="text-brand-gold text-sm font-medium flex items-center gap-1.5 hover:text-brand-gold-dark">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-lg" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fields.map(({ key, label, desc, color }) => (
                    <div key={key} className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                      <span className="text-[10px] text-gray-400 absolute top-0 right-0">{desc}</span>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input type="number" value={rates[key]} onChange={e => setRates({ ...rates, [key]: Number(e.target.value) })}
                          className={`w-full border rounded-lg pl-8 pr-4 py-3 text-lg font-bold text-brand-dark outline-none transition-all focus:ring-4 ${color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={handleSave} disabled={saving || loading}
                className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-8 py-3 rounded-md transition-colors disabled:opacity-50">
                <Save size={18} /> {saving ? 'Saving...' : 'Publish Rates'}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 text-sm mb-2">How dynamic pricing works</h4>
            <ul className="text-sm text-blue-700 space-y-1.5 list-disc pl-5">
              <li>Base price = Net Weight × (Metal Rate / 10)</li>
              <li>Making charges added based on product settings (flat, % or per gram).</li>
              <li>Changes apply instantly to all products using dynamic pricing.</li>
            </ul>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
