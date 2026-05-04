import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | categoryId
  const [form, setForm] = useState({ name: '', description: '', image: null });
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const startEdit = (cat) => {
    setEditing(cat ? cat._id : 'new');
    setForm(cat ? { name: cat.name, description: cat.description || '', image: cat.image || null } : { name: '', description: '', image: null });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'vss/categories');
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, image: { url: data.data.url, publicId: data.data.publicId } }));
    } catch { toast.error('Upload failed'); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/categories', form);
        toast.success('Category created');
      } else {
        await api.put(`/categories/${editing}`, form);
        toast.success('Category updated');
      }
      setEditing(null);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetchCategories(); }
    catch { toast.error('Failed'); }
  };

  return (
    <>
      <Helmet><title>Categories | Admin | VSS</title></Helmet>
      <AdminLayout title="Manage Categories">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-heading font-medium text-brand-dark">Categories</h3>
            <button onClick={() => startEdit(null)} className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              <Plus size={16} /> Add Category
            </button>
          </div>

          {/* Edit/Create Form */}
          {editing && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h4 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4">{editing === 'new' ? 'New Category' : 'Edit Category'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Description</label>
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Image</label>
                  <div className="flex items-center gap-3">
                    {form.image?.url && <img src={form.image.url} alt="" className="w-12 h-12 rounded object-cover border border-gray-200" />}
                    <label className="flex items-center gap-2 text-sm text-brand-gold font-medium cursor-pointer hover:text-brand-gold-dark">
                      <Upload size={14} /> Upload
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-dark"><X size={14} className="inline mr-1" />Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />)}</div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center"><p className="text-gray-500">No categories yet</p></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <div key={cat._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {cat.image?.url ? <img src={cat.image.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">—</div>}
                      </div>
                      <div>
                        <p className="font-medium text-brand-dark text-sm">{cat.name}</p>
                        {cat.description && <p className="text-xs text-gray-400 line-clamp-1">{cat.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(cat)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit size={15} /></button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
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
