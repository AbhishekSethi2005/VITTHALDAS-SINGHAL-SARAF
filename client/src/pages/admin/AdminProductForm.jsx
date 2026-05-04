import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Save, Upload, X, Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '', description: '', category: '', metalType: 'gold', purity: '22K',
  grossWeight: '', netWeight: '', pricingType: 'dynamic', fixedPrice: '',
  makingCharges: '', makingChargeType: 'per_gram', stoneCharges: '',
  occasion: [], gender: 'women', isFeatured: false, isActive: true,
  tags: '', variants: [], images: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch categories
  useEffect(() => {
    setCatLoading(true);
    setCatError(false);
    api.get('/categories')
      .then(({ data }) => {
        setCategories(data.data || []);
        if (!data.data || data.data.length === 0) setCatError(true);
      })
      .catch(() => { setCatError(true); setCategories([]); })
      .finally(() => setCatLoading(false));
  }, []);

  // Fetch product for editing using dedicated admin endpoint
  useEffect(() => {
    if (!isEdit) return;
    setLoadingProduct(true);
    api.get(`/products/admin/${id}`)
      .then(({ data }) => {
        const p = data.data;
        if (p) setForm({
          name: p.name || '', description: p.description || '',
          category: p.category?._id || p.category || '',
          metalType: p.metalType || 'gold', purity: p.purity || '22K',
          grossWeight: p.grossWeight || '', netWeight: p.netWeight || '',
          pricingType: p.pricingType || 'dynamic', fixedPrice: p.fixedPrice || '',
          makingCharges: p.makingCharges || '', makingChargeType: p.makingChargeType || 'per_gram',
          stoneCharges: p.stoneCharges || '', occasion: p.occasion || [], gender: p.gender || 'women',
          isFeatured: p.isFeatured || false, isActive: p.isActive !== false,
          tags: (p.tags || []).join(', '), variants: p.variants || [], images: p.images || [],
        });
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.category) errs.category = 'Please select a category';
    if (form.pricingType === 'dynamic') {
      if (!form.netWeight && form.variants.length === 0) errs.netWeight = 'Net weight is required for dynamic pricing (or add variants)';
    } else if (form.pricingType === 'fixed') {
      if (!form.fixedPrice) errs.fixedPrice = 'Fixed price is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('folder', 'vss/products');
        const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setForm(f => ({ ...f, images: [...f.images, { url: data.data.url, publicId: data.data.publicId, alt: f.name }] }));
      }
      toast.success('Images uploaded');
    } catch { toast.error('Upload failed — check Cloudinary config'); }
    finally { setUploading(false); }
  };

  const removeImage = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { size: '', grossWeight: '', netWeight: '', sku: '', stock: 1 }] }));
  const updateVariant = (idx, key, val) => setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === idx ? { ...v, [key]: val } : v) }));
  const removeVariant = (idx) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));

  // Estimate price preview
  const estimatedPrice = (() => {
    if (form.pricingType === 'fixed') return Number(form.fixedPrice) || 0;
    const weight = Number(form.netWeight) || 0;
    if (!weight) return 0;
    const rates = { gold: { '24K': 72000, '22K': 66000, '18K': 54000 }, silver: { '999': 85000, '925': 78000 } };
    const rateMap = rates[form.metalType] || {};
    const rate = (rateMap[form.purity] || 0) / 10;
    const metalVal = weight * rate;
    let making = 0;
    if (form.makingChargeType === 'flat') making = Number(form.makingCharges) || 0;
    else if (form.makingChargeType === 'percentage') making = (metalVal * (Number(form.makingCharges) || 0)) / 100;
    else making = (Number(form.makingCharges) || 0) * weight;
    return Math.round(metalVal + making + (Number(form.stoneCharges) || 0));
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        grossWeight: Number(form.grossWeight) || 0,
        netWeight: Number(form.netWeight) || 0,
        makingCharges: Number(form.makingCharges) || 0,
        stoneCharges: Number(form.stoneCharges) || 0,
        fixedPrice: Number(form.fixedPrice) || 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        variants: form.variants.map(v => ({ ...v, grossWeight: Number(v.grossWeight) || 0, netWeight: Number(v.netWeight) || 0, stock: Number(v.stock) || 1 })),
      };
      if (isEdit) { await api.put(`/products/${id}`, payload); toast.success('Product updated!'); }
      else { await api.post('/products', payload); toast.success('Product created!'); }
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product'); }
    finally { setSaving(false); }
  };

  const inputClass = (key) => `w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${errors[key] ? 'border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold'}`;
  const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5";
  const errorMsg = (key) => errors[key] ? <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors[key]}</p> : null;

  if (loadingProduct) return (
    <>
      <Helmet><title>Loading... | Admin</title></Helmet>
      <AdminLayout title="Loading Product...">
        <div className="max-w-5xl mx-auto space-y-6">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-40 animate-pulse border border-gray-100" />)}
        </div>
      </AdminLayout>
    </>
  );

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit' : 'New'} Product | Admin</title></Helmet>
      <AdminLayout title={isEdit ? 'Edit Product' : 'New Product'}>
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">

          {/* ── Basic Info ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Product Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} className={inputClass('name')} placeholder="e.g. Traditional Gold Necklace" />
                {errorMsg('name')}
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={inputClass('')} placeholder="Describe the product — materials, craftsmanship, occasions..." />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                {catLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-3"><Loader2 size={14} className="animate-spin" /> Loading categories...</div>
                ) : catError && categories.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-700 text-sm font-medium">No categories found</p>
                    <p className="text-amber-600 text-xs mt-1">Go to <a href="/admin/categories" className="underline font-medium">Categories</a> to create some first.</p>
                  </div>
                ) : (
                  <>
                    <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass('category')}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    {errorMsg('category')}
                  </>
                )}
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select value={form.gender} onChange={e => set('gender', e.target.value)} className={inputClass('')}>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="unisex">Unisex</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Metal & Weight ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-6">Metal & Weight</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Metal Type</label>
                <select value={form.metalType} onChange={e => set('metalType', e.target.value)} className={inputClass('')}>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="platinum">Platinum</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Purity</label>
                <select value={form.purity} onChange={e => set('purity', e.target.value)} className={inputClass('')}>
                  {form.metalType === 'gold' && <><option value="24K">24K</option><option value="22K">22K</option><option value="18K">18K</option><option value="14K">14K</option><option value="916">916</option></>}
                  {form.metalType === 'silver' && <><option value="999">999</option><option value="925">925</option></>}
                  {form.metalType === 'platinum' && <option value="other">Platinum</option>}
                  {form.metalType === 'other' && <option value="other">Other</option>}
                </select>
              </div>
              <div>
                <label className={labelClass}>Gross Weight (g)</label>
                <input type="number" step="0.01" value={form.grossWeight} onChange={e => set('grossWeight', e.target.value)} className={inputClass('')} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Net Weight (g) *</label>
                <input type="number" step="0.01" value={form.netWeight} onChange={e => set('netWeight', e.target.value)} className={inputClass('netWeight')} placeholder="0.00" />
                {errorMsg('netWeight')}
              </div>
            </div>
          </div>

          {/* ── Pricing ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Pricing</h3>
              {estimatedPrice > 0 && (
                <div className="bg-brand-cream px-4 py-2 rounded-lg">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Est. Price: </span>
                  <span className="text-lg font-heading font-bold text-brand-dark">{formatPrice(estimatedPrice)}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Pricing Type</label>
                <select value={form.pricingType} onChange={e => set('pricingType', e.target.value)} className={inputClass('')}>
                  <option value="dynamic">Dynamic (Weight × Rate)</option>
                  <option value="fixed">Fixed Price</option>
                </select>
              </div>
              {form.pricingType === 'fixed' && (
                <div>
                  <label className={labelClass}>Fixed Price (₹) *</label>
                  <input type="number" value={form.fixedPrice} onChange={e => set('fixedPrice', e.target.value)} className={inputClass('fixedPrice')} placeholder="0" />
                  {errorMsg('fixedPrice')}
                </div>
              )}
              <div>
                <label className={labelClass}>Making Charges</label>
                <input type="number" step="0.01" value={form.makingCharges} onChange={e => set('makingCharges', e.target.value)} className={inputClass('')} placeholder="0" />
              </div>
              <div>
                <label className={labelClass}>Making Charge Type</label>
                <select value={form.makingChargeType} onChange={e => set('makingChargeType', e.target.value)} className={inputClass('')}>
                  <option value="per_gram">Per Gram (₹/g)</option>
                  <option value="flat">Flat (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Stone Charges (₹)</label>
                <input type="number" value={form.stoneCharges} onChange={e => set('stoneCharges', e.target.value)} className={inputClass('')} placeholder="0" />
              </div>
            </div>
            {form.pricingType === 'dynamic' && (
              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-3.5 text-xs text-blue-700">
                <strong>Formula:</strong> (Net Weight × Metal Rate per gram) + Making Charges + Stone Charges
              </div>
            )}
          </div>

          {/* ── Images ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-6">Images</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-24 h-28 rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-brand-gold text-white text-[8px] text-center py-0.5 font-bold">PRIMARY</span>}
                </div>
              ))}
              <label className={`w-24 h-28 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <Loader2 size={20} className="text-brand-gold animate-spin mb-1" /> : <Upload size={20} className="text-gray-400 mb-1" />}
                <span className="text-[9px] text-gray-400 font-medium">{uploading ? 'Uploading...' : 'Add Image'}</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {form.images.length === 0 && (
              <p className="text-xs text-gray-400">No images yet. Upload product photos to improve visibility and sales.</p>
            )}
          </div>

          {/* ── Variants ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Variants (Sizes)</h3>
              <button type="button" onClick={addVariant} className="flex items-center gap-1.5 text-sm text-brand-gold font-medium hover:text-brand-gold-dark"><Plus size={14} /> Add Variant</button>
            </div>
            {form.variants.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No variants added. Use variants for different ring sizes, bangle sizes, etc.</p>
            ) : (
              <div className="space-y-4">
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-5 gap-3 items-end bg-gray-50 p-4 rounded-lg">
                    <div><label className="text-[10px] text-gray-500 font-medium">Size</label><input value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className={inputClass('')} placeholder="e.g. 12" /></div>
                    <div><label className="text-[10px] text-gray-500 font-medium">Gross Wt (g)</label><input type="number" step="0.01" value={v.grossWeight} onChange={e => updateVariant(i, 'grossWeight', e.target.value)} className={inputClass('')} /></div>
                    <div><label className="text-[10px] text-gray-500 font-medium">Net Wt (g)</label><input type="number" step="0.01" value={v.netWeight} onChange={e => updateVariant(i, 'netWeight', e.target.value)} className={inputClass('')} /></div>
                    <div><label className="text-[10px] text-gray-500 font-medium">Stock</label><input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className={inputClass('')} /></div>
                    <button type="button" onClick={() => removeVariant(i)} className="w-10 h-10 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors mb-0.5"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Additional Details ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-6">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Occasions</label>
                <div className="flex flex-wrap gap-2">
                  {['wedding', 'daily-wear', 'festive', 'engagement', 'gift', 'office'].map(o => (
                    <button key={o} type="button" onClick={() => set('occasion', form.occasion.includes(o) ? form.occasion.filter(x => x !== o) : [...form.occasion, o])}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium capitalize transition-all ${form.occasion.includes(o) ? 'bg-brand-gold/10 border-brand-gold text-brand-gold-dark' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                      {o.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)} className={inputClass('')} placeholder="necklace, bridal, kundan" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="accent-brand-gold w-4 h-4" /><span className="text-sm font-medium text-gray-700">Featured Product</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="accent-brand-gold w-4 h-4" /><span className="text-sm font-medium text-gray-700">Active (Visible)</span></label>
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="flex justify-end gap-4 pb-8">
            <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
