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
  const [activeTab, setActiveTab] = useState('description');
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
    <div className="max-w-[1400px] mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="aspect-[4/5] bg-gradient-to-br from-[#f8f5f1] to-[#f0ebe5] rounded animate-pulse" />
        <div className="space-y-5 pt-4">
          {[1/4, 3/4, 1/3, 1].map((w, i) => (
            <div key={i} className="h-8 bg-gradient-to-r from-[#f8f5f1] to-[#f0ebe5] rounded animate-pulse" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-6 py-32 text-center bg-[#fbf9f6]">
      <h2 className="font-heading text-4xl font-medium text-[#5C0A0A] mb-6">Product Not Found</h2>
      <Link to="/shop" className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#e9c76a] text-[#5C0A0A] text-sm font-semibold uppercase tracking-widest hover:shadow-md transition duration-300 rounded-sm">
        Back to Shop
      </Link>
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
        <meta name="description" content={product?.description?.substring(0, 160) || 'Luxury Jewellery Collection'} />
      </Helmet>

      <div className="bg-gradient-to-r from-[#f9f6f1] to-[#f5f0e8] border-b border-[#E9D9C2]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-5">
          <div className="text-[10px] uppercase tracking-[0.15em] text-[#9c8b7a] font-medium flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-[#5C0A0A]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col-reverse md:flex-row gap-6 h-max lg:sticky lg:top-28">
            {images.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[70vh] hide-scrollbar py-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-[72px] h-[88px] flex-shrink-0 rounded overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10' : 'border-[#E9D9C2] opacity-70 hover:opacity-100'}`}>
                    <img src={img?.url || '/placeholder.jpg'} alt={product?.name || 'Jewellery'} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 aspect-[4/5] relative overflow-hidden group cursor-zoom-in rounded bg-[#f9f6f1]" onClick={() => setZoomOpen(true)}>
              {images[selectedImage]?.url ? (
                <img src={images[selectedImage]?.url || '/placeholder.jpg'} alt={product?.name || 'Jewellery'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="text-8xl font-heading text-[#D4AF37]/10 font-bold">VSS</span></div>
              )}
              <div className="absolute bottom-5 right-5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity text-white shadow-lg">
                <ZoomIn size={18} />
              </div>
              {product.isFeatured && (
                <div className="absolute top-5 left-5 bg-gradient-to-r from-[#D4AF37] to-[#e0c158] text-white text-[9px] font-bold px-5 py-2 uppercase tracking-widest shadow-md rounded">
                  Featured
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col pt-2">
            <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] mb-4">
              {product.metalType}<span className="mx-2.5 text-[#E9D9C2]">|</span>{product.purity}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-medium text-[#5C0A0A] leading-tight mb-4">{product.name}</h1>
            {product.sku && <p className="text-[10px] text-[#9c8b7a] font-medium tracking-wider uppercase mb-8">SKU: {product.sku}</p>}
            <div className="mb-10">
              <p className="text-3xl font-heading font-semibold text-[#5C0A0A] mb-2">{formatPrice(currentPrice)}</p>
              <p className="text-[11px] text-[#9c8b7a]">MRP Inclusive of all taxes</p>
            </div>

            {product.pricing?.variants?.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-[#5C0A0A] uppercase tracking-wider">Select Size</span>
                  <button className="text-[10px] text-[#D4AF37] underline underline-offset-2 font-medium hover:text-[#b39030] transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.pricing.variants.map((v, i) => (
                    <button key={i} onClick={() => setSelectedVariant(v)}
                      className={`min-w-[3.5rem] h-12 px-4 border rounded text-sm font-medium transition-all duration-300 ${selectedVariant?.variantId === v.variantId ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-[#5C0A0A] ring-1 ring-[#D4AF37]/30' : 'border-[#E9D9C2] text-[#9c8b7a] hover:border-[#D4AF37]/50'}`}>
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-10">
              <button onClick={handleAddToCart} disabled={adding} className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#5C0A0A] to-[#7a0f0f] hover:from-[#D4AF37] hover:to-[#e9c76a] text-white text-sm font-bold uppercase tracking-[0.12em] py-4 rounded shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                {adding ? <><span className="animate-spin">⏳</span> Adding...</> : <><ShoppingBag size={17} /> Add to Cart</>}
              </button>
              <button className="w-14 h-14 border border-[#E9D9C2] rounded flex items-center justify-center text-[#9c8b7a] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-300">
                <Heart size={19} />
              </button>
            </div>

            <a href={`https://wa.me/917512345678?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 border border-green-200 bg-green-50/50 hover:bg-green-50 text-green-700 font-medium text-sm py-4 rounded shadow-sm hover:shadow transition-all mb-12">
              <MessageCircle size={16} /> Ask About This on WhatsApp
            </a>

            <div className="bg-gradient-to-br from-[#f9f6f1] to-[#f4f0e7] border border-[#D4AF37]/20 p-7 rounded shadow-sm mb-12">
              <h3 className="text-xs font-bold text-[#5C0A0A] uppercase tracking-[0.15em] mb-6 flex items-center gap-3"><Shield size={16} className="text-[#D4AF37]" /> Price Transparency</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between"><span className="text-[#9c8b7a]">Metal Value ({currentWeight}g × ₹{pricing.ratePerGram}/g)</span><span className="text-[#5C0A0A] font-semibold">{formatPrice(pricing.basePrice)}</span></div>
                <div className="flex justify-between"><span className="text-[#9c8b7a]">Making Charges</span><span className="text-[#5C0A0A] font-semibold">{formatPrice(pricing.makingCharges)}</span></div>
                {pricing?.stoneCharges > 0 && <div className="flex justify-between"><span className="text-[#9c8b7a]">Stone Charges</span><span className="text-[#5C0A0A] font-semibold">{formatPrice(pricing.stoneCharges)}</span></div>}
                <div className="flex justify-between pt-5 mt-3 border-t border-[#D4AF37]/20 text-base font-heading font-bold text-[#5C0A0A]"><span>Subtotal</span><span>{formatPrice(pricing.totalBeforeTax)}</span></div>
                <p className="text-[9px] text-[#9c8b7a] text-right uppercase tracking-widest">+ 3% GST at checkout</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-5 py-10 border-y border-[#E9D9C2] mb-12">
              {[{i:<Award size={18}/>, l:'Certified', s:'Purity'}, {i:<Shield size={18}/>, l:'Lifetime', s:'Exchange'}, {i:<Truck size={18}/>, l:'Insured', s:'Shipping'}, {i:<RotateCcw size={18}/>, l:'14-Day', s:'Returns'}].map((b, index) => (
                <div key={index} className="flex flex-col items-center text-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shadow-sm">{b.i}</div>
                  <span className="text-[10px] font-semibold text-[#5C0A0A] uppercase tracking-wider leading-tight">{b.l}<br/>{b.s}</span>
                </div>
              ))}
            </div>

            <div className="mb-12">
              <div className="flex border-b border-[#E9D9C2]">
                {['description', 'details', 'care'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`relative py-4 px-6 text-xs uppercase tracking-wider font-medium transition-colors ${activeTab === tab ? 'text-[#5C0A0A] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#D4AF37]' : 'text-[#9c8b7a] hover:text-[#5C0A0A]/80'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="py-8">
                {activeTab === 'description' && <p className="text-sm text-[#6d6158] leading-relaxed">{product.description || "Crafted with precision and care, this exquisite piece embodies the legacy of Vitthaldas Singhal Saraf."}</p>}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                    <div><p className="text-[10px] text-[#9c8b7a] uppercase tracking-widest mb-1.5 font-medium">Metal</p><p className="text-sm font-medium text-[#5C0A0A] capitalize">{product.metalType} {product.purity}</p></div>
                    <div><p className="text-[10px] text-[#9c8b7a] uppercase tracking-widest mb-1.5 font-medium">Weight</p><p className="text-sm font-medium text-[#5C0A0A]">{currentWeight}g Net</p></div>
                    {product?.occasion?.length > 0 && (
                      <div className="col-span-2 mt-2">
                        <p className="text-[10px] text-[#9c8b7a] uppercase tracking-widest mb-2 font-medium">Best For</p>
                        <div className="flex flex-wrap gap-2">{product.occasion.map((o, i) => (<span key={i} className="text-[10px] bg-[#f9f6f1] border border-[#E9D9C2] text-[#6d6158] px-3 py-1.5 capitalize rounded font-medium">{o.replace('-', ' ')}</span>))}</div>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'care' && <ul className="space-y-3 text-sm text-[#6d6158]"><li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0"/>Store in a dry place away from direct sunlight.</li><li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0"/>Avoid contact with perfumes and chemicals.</li></ul>}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24 pt-16 border-t border-[#E9D9C2]">
            <div className="text-center mb-16 relative"><p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#D4AF37] mb-3">Similar Designs</p><h2 className="text-3xl md:text-4xl font-heading font-medium text-[#5C0A0A]">You May Also Like</h2></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{related?.map((p, index) => (<ProductCard key={p?._id || index} product={p} />))}</div>
          </section>
        )}
      </div>

      {zoomOpen && images[selectedImage]?.url && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button onClick={() => setZoomOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><X size={20} /></button>
          <img src={images[selectedImage]?.url || '/placeholder.jpg'} alt={product?.name || 'Jewellery'} className="max-w-full max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}