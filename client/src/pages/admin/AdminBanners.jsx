import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Upload, GripVertical, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', link: '/shop', image: null });

  const fetchBanners = () => {
    setLoading(true);
    api.get('/settings')
      .then(({ data }) => setBanners(data.data.banners || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'vss/banners');
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewBanner(f => ({ ...f, image: { url: data.data.url, publicId: data.data.publicId } }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const addBanner = async () => {
    if (!newBanner.title || !newBanner.image) { toast.error('Title and image are required'); return; }
    try {
      await api.post('/settings/banners', newBanner);
      toast.success('Banner added');
      setNewBanner({ title: '', subtitle: '', link: '/shop', image: null });
      fetchBanners();
    } catch { toast.error('Failed'); }
  };

  const deleteBanner = async (bannerId) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.delete(`/settings/banners/${bannerId}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch { toast.error('Failed'); }
  };

  const toggleBanner = async (bannerId, currentActive) => {
    try {
      const updated = banners.map(b => b._id === bannerId ? { ...b, isActive: !currentActive } : b);
      await api.put('/settings/banners', { banners: updated });
      toast.success(currentActive ? 'Banner hidden' : 'Banner visible');
      fetchBanners();
    } catch { toast.error('Failed'); }
  };

  return (
    <>
      <Helmet><title>Banners | Admin | VSS</title></Helmet>
      <AdminLayout title="Manage Banners">
        <div className="max-w-4xl mx-auto">
          {/* Add New Banner */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-6">Add New Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Title *</label>
                <input value={newBanner.title} onChange={e => setNewBanner(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Summer Bridal Collection" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Subtitle</label>
                <input value={newBanner.subtitle} onChange={e => setNewBanner(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Optional tagline" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Link</label>
                <input value={newBanner.link} onChange={e => setNewBanner(f => ({ ...f, link: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Banner Image *</label>
                <div className="flex items-center gap-3">
                  {newBanner.image?.url && <img src={newBanner.image.url} alt="" className="w-20 h-12 rounded object-cover border" />}
                  <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${uploading ? 'text-gray-400' : 'text-brand-gold hover:text-brand-gold-dark'}`}>
                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button onClick={addBanner} className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
                <Plus size={16} /> Add Banner
              </button>
            </div>
          </div>

          {/* Banner List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Current Banners ({banners.length})</h3>
            </div>
            {loading ? (
              <div className="p-8 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />)}</div>
            ) : banners.length === 0 ? (
              <div className="p-12 text-center"><p className="text-gray-500">No banners yet. Add one above.</p></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {banners.map((banner, idx) => (
                  <div key={banner._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <GripVertical size={16} className="text-gray-300 shrink-0 cursor-grab" />
                    <div className="w-24 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {banner.image?.url ? <img src={banner.image.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-dark text-sm">{banner.title}</p>
                      {banner.subtitle && <p className="text-xs text-gray-400 line-clamp-1">{banner.subtitle}</p>}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${banner.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {banner.isActive ? 'Active' : 'Hidden'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleBanner(banner._id, banner.isActive)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                        {banner.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => deleteBanner(banner._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
