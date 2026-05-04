import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, Loader2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [businessForm, setBusinessForm] = useState({
    phone: '', whatsapp: '', email: '', address: '', mapEmbedUrl: '',
  });
  const [taxForm, setTaxForm] = useState({ gstRate: 3, freeShippingThreshold: 50000, shippingCharges: 500 });

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => {
        const s = data.data;
        setSettings(s);
        setBusinessForm({
          phone: s.businessInfo?.phone || '',
          whatsapp: s.businessInfo?.whatsapp || '',
          email: s.businessInfo?.email || '',
          address: s.businessInfo?.address || '',
          mapEmbedUrl: s.businessInfo?.mapEmbedUrl || '',
        });
        setTaxForm({
          gstRate: s.gstRate || 3,
          freeShippingThreshold: s.freeShippingThreshold || 50000,
          shippingCharges: s.shippingCharges || 500,
        });
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const saveBusiness = async () => {
    setSaving(true);
    try {
      await api.put('/settings/business', businessForm);
      toast.success('Business info updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all';
  const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5';

  return (
    <>
      <Helmet><title>Settings | Admin | VSS</title></Helmet>
      <AdminLayout title="Store Settings">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-brand-gold" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">

            {/* Business Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-6 flex items-center gap-2">
                <MapPin size={16} className="text-brand-gold" /> Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    value={businessForm.phone}
                    onChange={e => setBusinessForm(f => ({ ...f, phone: e.target.value }))}
                    className={inputClass}
                    placeholder="+91 751 234 5678"
                  />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp Number</label>
                  <input
                    value={businessForm.whatsapp}
                    onChange={e => setBusinessForm(f => ({ ...f, whatsapp: e.target.value }))}
                    className={inputClass}
                    placeholder="+91 751 234 5678"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={businessForm.email}
                    onChange={e => setBusinessForm(f => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                    placeholder="info@vssaraf.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Store Address</label>
                  <textarea
                    value={businessForm.address}
                    onChange={e => setBusinessForm(f => ({ ...f, address: e.target.value }))}
                    rows={2}
                    className={inputClass}
                    placeholder="Sarafa Bazar, Lashkar, Gwalior..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Google Maps Embed URL</label>
                  <input
                    value={businessForm.mapEmbedUrl}
                    onChange={e => setBusinessForm(f => ({ ...f, mapEmbedUrl: e.target.value }))}
                    className={inputClass}
                    placeholder="https://maps.google.com/embed?..."
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={saveBusiness}
                  disabled={saving}
                  className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Business Info'}
                </button>
              </div>
            </div>

            {/* Tax & Shipping */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-2">
                Tax & Shipping Configuration
              </h3>
              <p className="text-xs text-gray-400 mb-6">These values affect order totals across the platform.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>GST Rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={taxForm.gstRate}
                      onChange={e => setTaxForm(f => ({ ...f, gstRate: Number(e.target.value) }))}
                      className={inputClass}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Applied on gold jewellery (typically 3%)</p>
                </div>
                <div>
                  <label className={labelClass}>Free Shipping Above (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      step="1000"
                      value={taxForm.freeShippingThreshold}
                      onChange={e => setTaxForm(f => ({ ...f, freeShippingThreshold: Number(e.target.value) }))}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Standard Shipping Charge (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      step="50"
                      value={taxForm.shippingCharges}
                      onChange={e => setTaxForm(f => ({ ...f, shippingCharges: Number(e.target.value) }))}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={async () => {
                    setSaving(true);
                    try {
                      // Update via direct settings endpoint — patch gstRate, shipping
                      await api.put('/settings/rates', taxForm);
                      toast.success('Tax & shipping settings saved');
                    } catch (err) {
                      toast.error(err.response?.data?.message || 'Failed to save');
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Tax & Shipping'}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <h4 className="font-semibold text-amber-800 text-sm mb-2">
                Store Information
              </h4>
              <ul className="text-sm text-amber-700 space-y-1.5 list-disc pl-5">
                <li>Business info is displayed in the website footer and contact page.</li>
                <li>GST is charged on top of the product subtotal at checkout.</li>
                <li>Free shipping is automatically applied when order total exceeds the threshold.</li>
                <li>Metal rates are managed separately under <strong>Metal Rates</strong>.</li>
              </ul>
            </div>

          </div>
        )}
      </AdminLayout>
    </>
  );
}
