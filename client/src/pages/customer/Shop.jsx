import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, X, ChevronRight, Grid3X3, List } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import api from '../../utils/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const metalType = searchParams.get('metalType') || '';
  const occasion = searchParams.get('occasion') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (metalType) params.set('metalType', metalType);
    if (occasion) params.set('occasion', occasion);
    params.set('sort', sort);
    params.set('page', page);
    params.set('limit', '12');

    api.get(`/products?${params.toString()}`)
      .then(({ data }) => { setProducts(data.data || []); setPagination(data.pagination || {}); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [metalType, occasion, sort, page]);

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const hasActiveFilters = metalType || occasion;
  const title = metalType ? `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} Jewellery` : occasion ? `${occasion.charAt(0).toUpperCase() + occasion.slice(1).replace('-', ' ')} Collection` : 'All Jewellery';

  return (
    <>
      <Helmet><title>{title} | Vitthaldas Singhal Saraf</title></Helmet>

      {/* Premium Header */}
      <div className="bg-brand-dark py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-medium flex items-center justify-center gap-2 mb-4">
            <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-brand-gold-light">Shop</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">{title}</h1>
          <p className="text-gray-400 mt-2 font-light text-sm">
            {pagination.total ? `${pagination.total} pieces` : 'Discover our collection'}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-8 sm:py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden flex items-center gap-2 text-sm border border-gray-200 rounded-sm px-4 py-2.5 font-medium hover:border-gray-400 transition-colors">
              <SlidersHorizontal size={14} /> Filters {hasActiveFilters && <span className="w-2 h-2 bg-brand-gold rounded-full" />}
            </button>
            {hasActiveFilters && (
              <div className="hidden md:flex items-center gap-2">
                {metalType && <span className="text-xs bg-brand-cream text-brand-dark font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 capitalize">{metalType} <button onClick={() => setFilter('metalType', '')}><X size={12} /></button></span>}
                {occasion && <span className="text-xs bg-brand-cream text-brand-dark font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 capitalize">{occasion.replace('-', ' ')} <button onClick={() => setFilter('occasion', '')}><X size={12} /></button></span>}
              </div>
            )}
          </div>
          <select value={sort} onChange={e => setFilter('sort', e.target.value)}
            className="text-sm border border-gray-200 rounded-sm px-4 py-2.5 bg-white focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none font-medium">
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} md:block w-56 shrink-0`}>
            <div className="bg-white border border-gray-100 rounded-sm p-5 sticky top-28">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-xs text-brand-dark uppercase tracking-wider">Filters</h3>
                {hasActiveFilters && <button onClick={() => { setFilter('metalType', ''); setFilter('occasion', ''); }} className="text-[10px] text-red-500 font-medium flex items-center gap-0.5"><X size={11} /> Clear</button>}
              </div>

              <div className="mb-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Metal Type</h4>
                {['gold', 'silver', 'platinum'].map(m => (
                  <label key={m} className="flex items-center gap-2.5 py-2 text-sm cursor-pointer group">
                    <input type="radio" name="metal" checked={metalType === m} onChange={() => setFilter('metalType', m)} className="accent-brand-gold w-3.5 h-3.5" />
                    <span className="capitalize text-gray-700 group-hover:text-brand-gold font-medium">{m}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6 pt-5 border-t border-gray-100">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Occasion</h4>
                {['wedding', 'daily-wear', 'festive', 'engagement', 'gift'].map(o => (
                  <label key={o} className="flex items-center gap-2.5 py-2 text-sm cursor-pointer group">
                    <input type="radio" name="occasion" checked={occasion === o} onChange={() => setFilter('occasion', o)} className="accent-brand-gold w-3.5 h-3.5" />
                    <span className="capitalize text-gray-700 group-hover:text-brand-gold font-medium">{o.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-sm animate-shimmer aspect-[3/4]" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-5xl mb-4 block">💎</span>
                <h3 className="text-xl font-heading font-semibold text-brand-dark mb-2">No products found</h3>
                <p className="text-gray-500 font-light">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button key={i} onClick={() => setFilter('page', String(i + 1))}
                        className={`w-10 h-10 rounded-sm text-sm font-medium transition-all ${pagination.page === i + 1 ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
