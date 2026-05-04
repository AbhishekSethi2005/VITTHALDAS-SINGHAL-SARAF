import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchProducts = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 15 });
    if (search) params.set('search', search);
    api.get(`/products/admin/all?${params}`)
      .then(({ data }) => { setProducts(data.data || []); setPagination(data.pagination || {}); })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(1); };

  const toggleActive = async (id, currentActive) => {
    try {
      await api.put(`/products/${id}`, { isActive: !currentActive });
      toast.success(currentActive ? 'Product hidden' : 'Product visible');
      fetchProducts(page);
    } catch { toast.error('Failed to update'); }
  };

  const deleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts(page);
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Helmet><title>Products | Admin | VSS</title></Helmet>
      <AdminLayout title="Manage Products">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Search</button>
          </form>
          <Link to="/admin/products/new" className="flex items-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />)}</div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-gray-500 font-medium">No products found</p>
              <Link to="/admin/products/new" className="text-brand-gold text-sm font-medium mt-2 inline-block hover:underline">Add your first product</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Metal</th>
                    <th className="px-6 py-4">Weight</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded bg-gray-100 overflow-hidden shrink-0">
                            {p.images?.[0]?.url ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">No img</div>}
                          </div>
                          <div>
                            <p className="font-medium text-brand-dark line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.category?.name || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-xs">{p.sku || '—'}</td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{p.metalType} {p.purity}</td>
                      <td className="px-6 py-4 text-gray-600">{p.netWeight}g</td>
                      <td className="px-6 py-4 font-medium text-brand-dark">{formatPrice(p.pricing?.totalBeforeTax)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/products/edit/${p._id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit size={15} /></Link>
                          <button onClick={() => toggleActive(p._id, p.isActive)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                            {p.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <button onClick={() => deleteProduct(p._id, p.name)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Showing {products.length} of {pagination.total}</p>
              <div className="flex gap-1">{[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded text-xs font-medium ${pagination.page === i + 1 ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{i + 1}</button>
              ))}</div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
