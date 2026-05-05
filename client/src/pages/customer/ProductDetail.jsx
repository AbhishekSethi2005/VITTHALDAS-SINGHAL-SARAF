import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Heart, Shield, Truck, RotateCcw, Award, MessageCircle, ChevronRight, X, ZoomIn } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.data);
        if (data.data.pricing?.variants?.length > 0) setSelectedVariant(data.data.pricing.variants[0]);
        setRelated(data.data.relatedProducts || []);
        setSelectedImage(0);
        window.scrollTo(0, 0);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-[1400px] mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="aspect-[4/5] bg-gray-100 rounded-sm animate-shimmer" />
        <div className="space-y-5 pt-4">
          {[1/4,3/4,1/3,1].map((w,i) => <div key={i} className="h-8 bg-gray-100 rounded animate-shimmer" style={{width:`${w*100}%`}} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h2 className="text-3xl font-heading font-bold text-brand-dark mb-4">Product Not Found</h2>
      <Link to="/shop" className="text-brand-gold hover:underline text-sm font-semibold uppercase tracking-widest">Back to Shop</Link>
    </div>
  );

  const pricing = selectedVariant?.pricing || product.pricing || {};
  const currentWeight = selectedVariant?.weight || product.netWeight;
  const currentPrice = pricing.totalBeforeTax || 0;
  const images = product.images?.length > 0 ? product.images : [{ url: null }];

  const handleAddToCart = async () => {
    if (!user) {
      toast('Please login to add items to cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    const success = await addToCart(product._id);
    if (success) toast.success('Added to cart!');
    else toast.error('Failed to add to cart');
    setAdding(false);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Vitthaldas Singhal Saraf</title>
        <meta name="description" content={product.description?.substring(0, 160)} />
      </Helmet>

      <div className="bg-brand-cream/40 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-brand-dark">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 h-max lg:sticky lg:top-28">
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[70vh] hide-scrollbar py-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-[72px] h-[88px] flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-brand-gold shadow-md' : 'border-gray-200 opacity-60 hover:opacity-100'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 bg-brand-cream aspect-[4/5] relative overflow-hidden group cursor-zoom-in rounded-sm" onClick={() => setZoomOpen(true)}>
              {images[selectedImage]?.url ? (
                <img src={images[selectedImage].url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="text-8xl font-heading text-brand-gold/10 font-bold">VSS</span></div>
              )}
              <div className="absolute bottom-4 right-4 glass rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-white/70"><ZoomIn size={16} /></div>
              {product.isFeatured && <div className="absolute top-4 left-4 bg-brand-gold text-white text-[9px] font-bold px-4 py-1.5 uppercase tracking-widest shadow-md rounded-sm">Featured</div>}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-2">
            <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.25em] mb-3">{product.metalType}<span className="mx-2.5 text-gray-300">|</span>{product.purity}</p>
            <h1 className="text-3xl md:text-4xl font-heading font-medium text-brand-dark leading-tight mb-3">{product.name}</h1>
            {product.sku && <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mb-6">SKU: {product.sku}</p>}

            <div className="mb-8">
              <p className="text-3xl font-semibold text-brand-dark mb-1.5">{formatPrice(currentPrice)}</p>
              <p className="text-[11px] text-brand-muted">MRP Inclusive of all taxes</p>
            </div>

            {product.pricing?.variants?.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">Select Size</span>
                  <button className="text-[10px] text-brand-gold underline underline-offset-2 font-medium">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.pricing.variants.map((v, i) => (
                    <button key={i} onClick={() => setSelectedVariant(v)}
                      className={`min-w-[3.5rem] h-12 px-4 border rounded-sm text-sm font-medium transition-all ${selectedVariant?.variantId === v.variantId ? 'border-brand-gold bg-brand-gold/5 text-brand-gold-dark ring-1 ring-brand-gold/50' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <button onClick={handleAddToCart} disabled={adding} className="flex-1 flex items-center justify-center gap-3 bg-brand-dark hover:bg-brand-gold text-white text-sm font-bold uppercase tracking-[0.12em] py-4 rounded-sm transition-colors duration-300 disabled:opacity-50">
                {adding ? <><span className="animate-spin">⏳</span> Adding...</> : <><ShoppingBag size={17} /> Add to Cart</>}
              </button>
              <button className="w-14 h-14 border border-gray-200 rounded-sm flex items-center justify-center text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-all">
                <Heart size={19} />
              </button>
            </div>

            <a href={`https://wa.me/917512345678?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-green-200 bg-green-50/50 hover:bg-green-50 text-green-700 font-medium text-sm py-3.5 rounded-sm transition-all mb-10">
              <MessageCircle size={16} /> Ask About This on WhatsApp
            </a>

            {/* Price Transparency */}
            <div className="bg-brand-cream/60 border border-brand-gold/15 p-6 rounded-sm mb-10">
              <h3 className="text-xs font-bold text-brand-dark uppercase tracking-[0.15em] mb-5 flex items-center gap-2.5">
                <Shield size={15} className="text-brand-gold" /> Price Transparency
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 font-light">Metal Value ({currentWeight}g × ₹{pricing.ratePerGram}/g)</span><span className="text-brand-dark font-semibold">{formatPrice(pricing.basePrice)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-light">Making Charges</span><span className="text-brand-dark font-semibold">{formatPrice(pricing.makingCharges)}</span></div>
                {pricing.stoneCharges > 0 && <div className="flex justify-between"><span className="text-gray-500 font-light">Stone Charges</span><span className="text-brand-dark font-semibold">{formatPrice(pricing.stoneCharges)}</span></div>}
                <div className="flex justify-between pt-4 mt-3 border-t border-brand-gold/20 text-base font-bold text-brand-dark"><span>Subtotal</span><span>{formatPrice(pricing.totalBeforeTax)}</span></div>
                <p className="text-[9px] text-gray-400 text-right uppercase tracking-widest">+ 3% GST at checkout</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-4 gap-4 py-8 border-y border-gray-100 mb-10">
              {[{i:<Award size={18}/>,l:'Certified',s:'Purity'},{i:<Shield size={18}/>,l:'Lifetime',s:'Exchange'},{i:<Truck size={18}/>,l:'Insured',s:'Shipping'},{i:<RotateCcw size={18}/>,l:'14-Day',s:'Returns'}].map(b=>(
                <div key={b.l} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/8 flex items-center justify-center text-brand-gold">{b.i}</div>
                  <span className="text-[9px] font-semibold text-brand-dark uppercase tracking-wider leading-tight">{b.l}<br/>{b.s}</span>
                </div>
              ))}
            </div>

            {/* Product Description + Why Buy This */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-brand-dark uppercase tracking-[0.15em] mb-3">Product Details</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{product.description || "Crafted with precision and care, this exquisite piece embodies the legacy of Vitthaldas Singhal Saraf."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gray-100">
                <div><p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 font-medium">Metal</p><p className="text-sm font-medium text-brand-dark capitalize">{product.metalType} {product.purity}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 font-medium">Weight</p><p className="text-sm font-medium text-brand-dark">{currentWeight}g Net</p></div>
                {product.occasion?.length > 0 && <div className="col-span-2"><p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-medium">Best For</p><div className="flex flex-wrap gap-2">{product.occasion.map((o,i)=><span key={i} className="text-[10px] bg-brand-cream text-gray-600 px-3 py-1.5 capitalize rounded-sm font-medium">{o.replace('-',' ')}</span>)}</div></div>}
              </div>
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold text-brand-dark uppercase tracking-[0.15em] mb-3">Why Buy This</h3>
                <ul className="space-y-2.5 text-sm text-gray-600 font-light">
                  {['Handcrafted by master artisans with decades of experience.','BIS Hallmark certified for guaranteed purity.','Transparent pricing — no hidden charges.','Lifetime exchange guarantee at full gold value.'].map((t,i)=>(
                    <li key={i} className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"/>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24 pt-16 border-t border-gray-100">
            <div className="text-center mb-12">
              <p className="section-ornament text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-gold mb-3 justify-center">Similar Designs</p>
              <h2 className="text-2xl md:text-3xl font-heading font-medium text-brand-dark">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{related.map(p=><ProductCard key={p._id} product={p}/>)}</div>
          </section>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomOpen && images[selectedImage]?.url && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={()=>setZoomOpen(false)}>
          <button onClick={()=>setZoomOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><X size={20}/></button>
          <img src={images[selectedImage].url} alt={product.name} className="max-w-full max-h-[90vh] object-contain animate-fade-in" onClick={e=>e.stopPropagation()} />
          {images.length > 1 && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">{images.map((img,i)=><button key={i} onClick={e=>{e.stopPropagation();setSelectedImage(i)}} className={`w-14 h-16 rounded overflow-hidden border-2 transition-all ${selectedImage===i?'border-brand-gold opacity-100':'border-transparent opacity-50 hover:opacity-80'}`}><img src={img.url} alt="" className="w-full h-full object-cover"/></button>)}</div>}
        </div>
      )}
    </>
  );
}
