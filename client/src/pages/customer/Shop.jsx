import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import LuxuryPageBanner from '../../components/common/LuxuryPageBanner';
import api from '../../utils/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const metalType = searchParams.get('metalType') || '';
  const occasion = searchParams.get('occasion') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (metalType) params.set('metalType', metalType);
    if (occasion) params.set('occasion', occasion);
    if (category) params.set('category', category);
    params.set('sort', sort);
    params.set('page', page);
    params.set('limit', '12');

    api.get(`/products?${params.toString()}`)
      .then(({ data }) => { setProducts(data.data || []); setPagination(data.pagination || {}); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [metalType, occasion, category, sort, page]);

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const hasActiveFilters = metalType || occasion || category;
  const title = category
    ? 'Category Collection'
    : metalType
      ? `${metalType.charAt(0).toUpperCase() + metalType.slice(1)} Jewellery`
      : occasion
        ? `${occasion.charAt(0).toUpperCase() + occasion.slice(1).replace('-', ' ')} Collection`
        : 'All Jewellery';

  return (
    <>
      <Helmet><title>{title} | Vitthaldas Singhal Saraf</title></Helmet>

      <style>{shopStyles}</style>

      <div className="shop-page">
        {/* Hero Header */}
        <LuxuryPageBanner
          title={title}
          subtitle={pagination.total ? `${pagination.total} exquisite pieces` : 'Discover our collection'}
          bgImage="https://static.vecteezy.com/system/resources/thumbnails/056/184/062/small/jewelry-red-rhinestones-photo.jpg?auto=format&fit=crop&q=80&w=2000"
          breadcrumbs={[{ label: 'Shop' }]}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="filter-toggle-btn"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {hasActiveFilters && <span className="filter-dot" />}
              </button>

              {/* Active filter chips */}
              {metalType && (
                <span className="filter-chip">
                  <span style={{ textTransform: 'capitalize' }}>{metalType}</span>
                  <button onClick={() => setFilter('metalType', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit', padding: '0 0 0 4px' }}>
                    <X size={11} />
                  </button>
                </span>
              )}
              {occasion && (
                <span className="filter-chip">
                  <span style={{ textTransform: 'capitalize' }}>{occasion.replace('-', ' ')}</span>
                  <button onClick={() => setFilter('occasion', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit', padding: '0 0 0 4px' }}>
                    <X size={11} />
                  </button>
                </span>
              )}
              {category && (
                <span className="filter-chip">
                  <span style={{ textTransform: 'capitalize' }}>Filtered Category</span>
                  <button onClick={() => setFilter('category', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'inherit', padding: '0 0 0 4px' }}>
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>

            <select
              value={sort}
              onChange={e => setFilter('sort', e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="shop-layout">
            {/* Sidebar */}
            <aside className={`shop-sidebar ${filtersOpen ? 'sidebar-open' : ''}`}>
              <div className="sidebar-inner">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a1208' }}>Refine</h3>
                  {hasActiveFilters && (
                    <button onClick={() => { setFilter('metalType', ''); setFilter('occasion', ''); setFilter('category', ''); }}
                      style={{ fontSize: '11px', color: '#e05a5a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'Jost,sans-serif' }}>
                      <X size={11} /> Clear All
                    </button>
                  )}
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h4 className="filter-section-title">Metal Type</h4>
                  {['gold', 'silver', 'platinum'].map(m => (
                    <label key={m} className="filter-option">
                      <span className={`radio-dot ${metalType === m ? 'active' : ''}`} onClick={() => setFilter('metalType', m)} />
                      <span style={{ textTransform: 'capitalize', cursor: 'pointer', fontSize: '14px' }} onClick={() => setFilter('metalType', m)}>{m}</span>
                    </label>
                  ))}
                </div>

                <div style={{ paddingTop: '20px', borderTop: '1px solid #ede0d0' }}>
                  <h4 className="filter-section-title">Occasion</h4>
                  {['wedding', 'daily-wear', 'festive', 'engagement', 'gift'].map(o => (
                    <label key={o} className="filter-option">
                      <span className={`radio-dot ${occasion === o ? 'active' : ''}`} onClick={() => setFilter('occasion', o)} />
                      <span style={{ textTransform: 'capitalize', cursor: 'pointer', fontSize: '14px' }} onClick={() => setFilter('occasion', o)}>{o.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div style={{ flex: 1 }}>
              {loading ? (
                <div className="product-grid-lux">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ aspectRatio: '3/4', background: '#f0e8de', animation: 'shimmer 1.5s infinite' }} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', border: '1px solid #ede0d0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.15 }}>💎</div>
                  <h3 className="ch" style={{ fontSize: '26px', color: '#1a1208', fontWeight: '400', marginBottom: '8px' }}>No pieces found</h3>
                  <p style={{ color: '#8a7060', fontSize: '13px', fontWeight: '300', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.7' }}>
                    We couldn't find anything matching your filters. Try adjusting them.
                  </p>
                  <button onClick={() => { setFilter('metalType', ''); setFilter('occasion', ''); }}
                    className="outline-gold-btn" style={{ padding: '10px 24px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="product-grid-lux">
                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>

                  {pagination.pages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px', alignItems: 'center' }}>
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setFilter('page', String(i + 1))}
                          style={{
                            width: '40px', height: '40px',
                            background: pagination.page === i + 1 ? '#1a1208' : 'white',
                            color: pagination.page === i + 1 ? 'white' : '#6a5848',
                            border: `1px solid ${pagination.page === i + 1 ? '#1a1208' : '#ede0d0'}`,
                            fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                            transition: 'all 0.2s', fontFamily: 'Jost,sans-serif',
                          }}
                          onMouseOver={e => { if (pagination.page !== i + 1) { e.currentTarget.style.borderColor = '#C5A059'; e.currentTarget.style.color = '#C5A059'; } }}
                          onMouseOut={e => { if (pagination.page !== i + 1) { e.currentTarget.style.borderColor = '#ede0d0'; e.currentTarget.style.color = '#6a5848'; } }}
                        >
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
      </div>
    </>
  );
}

const shopStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
  .shop-page { font-family: 'Jost', sans-serif; background: #fdf8f2; }
  .ch { font-family: 'Cormorant Garamond', serif; }
  .shop-hero {
    background: linear-gradient(160deg, #1a0e04 0%, #2d1a08 60%, #3a2010 100%);
    padding: 72px 24px 56px; position: relative; overflow: hidden;
  }
  .shop-hero::before {
    content: ''; position: absolute; top: -50px; left: 50%; transform: translateX(-50%);
    width: 500px; height: 500px; border: 1px solid rgba(197,160,89,0.07); border-radius: 50%;
    pointer-events: none;
  }
  .shop-layout { display: flex; gap: 36px; align-items: flex-start; }
  .shop-sidebar {
    width: 220px; flex-shrink: 0;
    display: none;
  }
  .shop-sidebar.sidebar-open, .shop-sidebar { display: block; }
  @media (min-width: 768px) { .shop-sidebar { display: block !important; } }
  @media (max-width: 767px) {
    .shop-sidebar { display: none; }
    .shop-sidebar.sidebar-open { display: block; }
  }
  .sidebar-inner {
    background: white; border: 1px solid #ede0d0;
    padding: 24px; position: sticky; top: 100px;
  }
  .filter-section-title {
    font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; color: #8a7060; margin-bottom: 16px;
    font-family: 'Jost', sans-serif;
  }
  .filter-option {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; cursor: pointer; color: #3a2c20;
    font-family: 'Jost', sans-serif;
  }
  .filter-option:hover span { color: #C5A059; }
  .radio-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1.5px solid #c8b8a8; flex-shrink: 0; cursor: pointer;
    transition: all 0.2s; display: inline-block;
  }
  .radio-dot.active {
    background: #C5A059; border-color: #C5A059;
    box-shadow: 0 0 0 2px rgba(197,160,89,0.25);
  }
  .product-grid-lux {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
  }
  .filter-toggle-btn {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 500; letter-spacing: 0.08em;
    border: 1px solid #ede0d0; padding: 8px 16px;
    background: white; cursor: pointer; color: #3a2c20;
    font-family: 'Jost', sans-serif; transition: border-color 0.2s;
  }
  .filter-toggle-btn:hover { border-color: #C5A059; color: #C5A059; }
  .filter-dot {
    width: 6px; height: 6px; background: #C5A059; border-radius: 50%; display: inline-block;
  }
  .filter-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 500;
    background: rgba(197,160,89,0.1); color: #8a6830;
    border: 1px solid rgba(197,160,89,0.3);
    padding: 5px 10px; letter-spacing: 0.05em;
    font-family: 'Jost', sans-serif;
  }
  .sort-select {
    font-size: 12px; font-weight: 500; letter-spacing: 0.05em;
    border: 1px solid #ede0d0; padding: 8px 36px 8px 14px;
    background: white; cursor: pointer; color: #3a2c20;
    font-family: 'Jost', sans-serif; outline: none;
    appearance: none; transition: border-color 0.2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a7060' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
  }
  .sort-select:focus { border-color: #C5A059; }
  .outline-gold-btn {
    background: none; border: 1px solid #C5A059; color: #C5A059;
    cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
    transition: all 0.2s;
  }
  .outline-gold-btn:hover { background: #C5A059; color: white; }
  @keyframes shimmer { 0%,100%{opacity:0.7} 50%{opacity:0.4} }
`;