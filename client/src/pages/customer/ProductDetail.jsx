import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingBag, Heart, Shield, Truck, RotateCcw, Award,
  MessageCircle, ChevronRight, X, ZoomIn, ChevronLeft,
  Star, Share2, Check, Phone, Users
} from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const { addToCart } = useCart();
  const { user, wishlist, toggleWishlist } = useAuth();
  
  const isWishlisted = wishlist?.some(item => item._id === product?._id);
  const thumbsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.data);
        if (data.data.pricing?.variants?.length > 0)
          setSelectedVariant(data.data.pricing.variants[0]);
        // fetch related
        return api.get(`/products?category=${data.data.category?._id || data.data.category}&limit=4`);
      })
      .then(({ data }) => setRelated(data.data.filter(p => p.slug !== slug)))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load product details");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6]">
      <div className="flex flex-col items-center gap-4">
        <span className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-xs text-[#9c8b7a] uppercase tracking-widest animate-pulse">Loading Details...</p>
      </div>
    </div>
  );
  if (!product) return <div className="text-center py-32 font-serif text-2xl text-[#5C0A0A]">Product not found.</div>;

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

      {/* ── Main Layout ── */}
      <div className="bg-[#fdfaf6] min-h-screen pb-24">

        {/* ── Breadcrumb ── */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-4">
          <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-medium text-[#8a7060]">
            <Link to="/" className="hover:text-[#5C0A0A] transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop" className="hover:text-[#5C0A0A] transition-colors">Collection</Link>
            <ChevronRight size={10} />
            {product.category?.name && (
              <>
                <Link to={`/shop?category=${product.category._id}`} className="hover:text-[#5C0A0A] transition-colors capitalize">
                  {product.category.name}
                </Link>
                <ChevronRight size={10} />
              </>
            )}
            <span className="text-[#5C0A0A] truncate max-w-[300px]">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">

          {/* Top Section: Images & Basic Info */}
          <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-16 xl:gap-28 items-start">

            {/* ════════════════════
                LEFT — Image Gallery
            ════════════════════ */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative w-full aspect-[4/4.5] md:aspect-[4/4.7] lg:aspect-[4/3] overflow-hidden rounded-[16px] bg-[#1a0f0d] cursor-zoom-in group shadow-sm" onClick={() => setZoomOpen(true)}>
                {images[selectedImage]?.url ? (
                  <img
                    src={images[selectedImage].url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f4f0e8]">
                    <span className="text-9xl font-serif text-[#D4AF37]/10 font-bold select-none">VSS</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#D4AF37] text-[#4a0e17] text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    {product.isFeatured ? 'Bestseller' : 'New Arrival'}
                  </span>
                </div>

                {/* Wishlist Heart overlay */}
                <button
                  onClick={async (e) => { 
                    e.stopPropagation(); 
                    if (!user) return navigate('/login');
                    try { await toggleWishlist(product._id); } catch(e){}
                  }}
                  className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/20 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition"
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current text-[#D4AF37] stroke-[#D4AF37]' : ''} />
                </button>

                {/* Prev/Next overlay */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedImage(p => Math.max(0, p - 1)); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4a0e17] hover:bg-white hover:scale-105 transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedImage(p => Math.min(images.length - 1, p + 1)); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4a0e17] hover:bg-white hover:scale-105 transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 relative items-center justify-center mt-2">
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedImage(p => Math.max(0, p - 1)); }}
                    className="w-8 h-8 rounded-full border border-[#E9D9C2] bg-white flex items-center justify-center text-[#4a0e17] hover:bg-[#E9D9C2]/20 transition flex-shrink-0"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-[70px] md:w-[90px] aspect-square rounded-[8px] overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-[#1a0f0d] ${selectedImage === i
                        ? 'border-[#D4AF37] opacity-100 ring-1 ring-[#D4AF37]/30 ring-offset-1'
                        : 'border-[#E9D9C2] opacity-70 hover:opacity-100 hover:border-[#D4AF37]'
                        }`}
                    >
                      <img
                        src={img?.url || '/placeholder.jpg'}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedImage(p => Math.min(images.length - 1, p + 1)); }}
                    className="w-8 h-8 rounded-full border border-[#E9D9C2] bg-white flex items-center justify-center text-[#4a0e17] hover:bg-[#E9D9C2]/20 transition flex-shrink-0"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* ════════════════════
                RIGHT — Info Panel
            ════════════════════ */}
            <div className="flex flex-col py-2">
              <p className="text-[11px] uppercase tracking-widest text-[#8a7060] mb-1 font-semibold">
                {product.metalType} {product.purity} GOLD
              </p>
              <h1 className="font-serif text-[38px] md:text-[46px] text-[#4a0e17] font-medium leading-[1.1] mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#E9D9C2]">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-[12px] text-[#6E6256] font-medium">4.9 (128 Reviews)</span>
                <span className="text-[#E9D9C2] mx-1">|</span>
                <span className="text-[12px] text-[#6E6256] uppercase tracking-wider font-medium">
                  SKU: {product.sku || 'VSS-NK-1024'}
                </span>
              </div>

              <div className="mb-3">
                <div className="font-serif text-[34px] md:text-[42px] font-semibold text-[#4a0e17] leading-none mb-2">
                  {formatPrice(currentPrice)}
                </div>
                <p className="text-[12px] text-[#8a7060] font-medium tracking-wide">(Inclusive of all taxes)</p>
              </div>

              <div className="mb-4 flex min-h-[50px] items-center gap-4 rounded-[18px] border border-[#D4AF37]/70 bg-[#fffdf8] px-6 shadow-[0_4px_18px_rgba(212,175,55,0.08)]">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/25">
                  <Shield size={18} className="text-[#B58B22] stroke-[2]" />
                </div>

                <span className="text-[14px] font-semibold tracking-[0.02em] text-[#2A2118]">
                  BIS 916 Hallmark Certified
                </span>
              </div>

              <div className="border-t border-b border-[#E9D9C2] py-2 mb-4">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div className="flex items-center gap-4">
                    <div className="text-[#a58957]">
                      <Award size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#8a7060] uppercase tracking-wider font-semibold mb-0.5">Gold Purity</p>
                      <p className="text-[14px] text-[#1a1208] font-bold">{product.purity || '22KT (916)'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[#a58957] font-serif text-2xl leading-none">
                      ⚖
                    </div>
                    <div>
                      <p className="text-[11px] text-[#8a7060] uppercase tracking-wider font-semibold mb-0.5">Net Weight</p>
                      <p className="text-[14px] text-[#1a1208] font-bold">{currentWeight} g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[#a58957] font-serif text-2xl leading-none">
                      ₹
                    </div>
                    <div>
                      <p className="text-[11px] text-[#8a7060] uppercase tracking-wider font-semibold mb-0.5">Making Charges</p>
                      <p className="text-[14px] text-[#1a1208] font-bold">{formatPrice(pricing.makingCharges || 7850)} (Approx.)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[#a58957]">
                      <Truck size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#8a7060] uppercase tracking-wider font-semibold mb-0.5">Delivery</p>
                      <p className="text-[14px] text-[#1a1208] font-bold">3 - 5 Working Days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full bg-[#cda940] hover:bg-[#b8952b] text-white text-[12px] font-bold uppercase tracking-[0.1em] py-4 rounded-[8px] flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag size={18} /> ADD TO CART
                </button>

                <a
                  href={`https://wa.me/917512345678`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#4a0e17] hover:bg-[#330a10] text-white text-[12px] font-bold uppercase tracking-[0.1em] py-4 rounded-[8px] flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle size={18} /> BOOK A VISIT ON WHATSAPP
                </a>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a href="tel:+917512345678" className="border border-[#E9D9C2] bg-transparent text-[#4a0e17] text-[12px] font-bold uppercase tracking-[0.1em] py-4 rounded-[8px] flex items-center justify-center gap-2 hover:bg-[#fdf8f0] hover:border-[#D4AF37] transition-all">
                    <Phone size={16} /> CALL US
                  </a>
                  <button
                    onClick={async (e) => { 
                      e.preventDefault();
                      if (!user) return navigate('/login');
                      try { await toggleWishlist(product._id); } catch(e){}
                    }}
                    className="border border-[#E9D9C2] bg-transparent text-[#4a0e17] text-[12px] font-bold uppercase tracking-[0.1em] py-4 rounded-[8px] flex items-center justify-center gap-2 hover:bg-[#fdf8f0] hover:border-[#D4AF37] transition-all"
                  >
                    <Heart size={16} className={isWishlisted ? 'fill-current text-[#4a0e17]' : ''} /> {isWishlisted ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── Trust Badges Strip ── */}
          <div className="mt-6 py-5 border-y border-[#E9D9C2] grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <Award size={36} className="text-[#a58957] stroke-[1]" />
              <div>
                <p className="text-[14px] font-bold text-[#1a1208] mb-1">100% Certified Jewellery</p>
                <p className="text-[12px] text-[#8a7060]">BIS 916 Hallmark</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <RotateCcw size={36} className="text-[#a58957] stroke-[1]" />
              <div>
                <p className="text-[14px] font-bold text-[#1a1208] mb-1">Lifetime Exchange</p>
                <p className="text-[12px] text-[#8a7060]">Full value exchange</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <Truck size={36} className="text-[#a58957] stroke-[1]" />
              <div>
                <p className="text-[14px] font-bold text-[#1a1208] mb-1">Secure Shipping</p>
                <p className="text-[12px] text-[#8a7060]">Insured & safe delivery</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <Shield size={36} className="text-[#a58957] stroke-[1]" />
              <div>
                <p className="text-[14px] font-bold text-[#1a1208] mb-1">Trusted Since 1965</p>
                <p className="text-[12px] text-[#8a7060]">Serving generations</p>
              </div>
            </div>
          </div>

          {/* ── Tabs Section ── */}
          <div className="mt-10 border border-[#E9D9C2] rounded-[16px] bg-white overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar border-b border-[#E9D9C2]">
              {['DESCRIPTION', 'SPECIFICATIONS', 'SHIPPING & RETURNS', 'CARE INSTRUCTIONS'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[160px] py-5 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors relative ${activeTab === tab
                    ? 'text-[#4a0e17] bg-[#fdf9f4]'
                    : 'text-[#8a7060] hover:text-[#4a0e17] hover:bg-[#fdfaf6]'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4a0e17]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8 lg:p-14 min-h-[400px]">
              {activeTab === 'DESCRIPTION' && (
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
                  <div>
                    <p className="text-[15px] text-[#4a0e17] leading-[1.8] mb-10 font-medium">
                      {product.description || "A timeless expression of tradition and elegance. This Heritage Gold Necklace Set is crafted in 22KT gold with intricate detailing inspired by classic Indian artistry. Perfect for weddings, festive occasions, and heirloom collections."}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
                      <div className="flex items-center gap-3"><Award size={20} className="text-[#D4AF37] shrink-0" /><span className="text-[14px] text-[#4a0e17] font-medium">Handcrafted by skilled karigars</span></div>
                      <div className="flex items-center gap-3"><Award size={20} className="text-[#D4AF37] shrink-0" /><span className="text-[14px] text-[#4a0e17] font-medium">Intricate traditional motifs</span></div>
                      <div className="flex items-center gap-3"><Shield size={20} className="text-[#D4AF37] shrink-0" /><span className="text-[14px] text-[#4a0e17] font-medium">Premium 22KT Hallmark Gold</span></div>
                      <div className="flex items-center gap-3"><Heart size={20} className="text-[#D4AF37] shrink-0" /><span className="text-[14px] text-[#4a0e17] font-medium">Perfect for weddings & occasions</span></div>
                    </div>
                  </div>

                  <div className="hidden lg:flex bg-gradient-to-br from-[#fdf8f0] to-[#f4ead8] border border-[#E9D9C2] rounded-[16px] p-10 relative overflow-hidden h-[300px] flex-col justify-center">
                    <div className="relative z-10 w-[80%]">
                      <h3 className="font-serif text-2xl text-[#4a0e17] mb-4 leading-tight font-medium">CRAFTED<br />WITH HERITAGE</h3>
                      <p className="text-[12px] text-[#6E6256] leading-relaxed font-medium">Each piece is a blend of timeless tradition and modern elegance, crafted with purity, passion and precision.</p>
                    </div>
                    <div className="absolute right-[-30px] bottom-[-30px] opacity-[0.05] text-[#4a0e17]">
                      <Award size={280} strokeWidth={0.5} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'SPECIFICATIONS' && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
                  {[
                    { label: 'Product Name', value: product.name },
                    { label: 'Metal Type', value: `${product.metalType} ${product.purity}` },
                    { label: 'Net Weight', value: `${currentWeight}g` },
                    { label: 'Gross Weight', value: `${currentWeight + (product.stoneWeight || 0)}g` },
                    { label: 'Product Code', value: product.sku },
                    { label: 'Certification', value: 'BIS Hallmark 916' },
                  ].map((spec, i) => (
                    <div key={i} className="pb-4 border-b border-[#E9D9C2]">
                      <p className="text-[11px] text-[#8a7060] uppercase tracking-wider mb-2 font-semibold">{spec.label}</p>
                      <p className="text-[15px] text-[#1a1208] font-bold">{spec.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'SHIPPING & RETURNS' && (
                <div className="text-[15px] text-[#4a0e17] leading-relaxed space-y-6 max-w-4xl">
                  <p><strong>Shipping:</strong> We offer free, insured shipping across India. Orders are typically dispatched within 48 hours and delivered within 3-5 working days depending on your location. All products are fully insured until they reach you.</p>
                  <p><strong>Returns:</strong> We offer a 14-day return policy for all our online purchases. The item must be unused, in its original condition, and with all tags and certifications intact. Custom-made orders cannot be returned.</p>
                  <p><strong>Exchange:</strong> Our lifetime exchange policy ensures you get the full value of the gold weight based on the prevailing market rate.</p>
                </div>
              )}

              {activeTab === 'CARE INSTRUCTIONS' && (
                <ul className="text-[15px] text-[#4a0e17] leading-relaxed space-y-4 max-w-4xl">
                  <li className="flex gap-4 items-start"><span className="text-[#D4AF37] mt-1">✦</span> Store your jewellery in a fabric-lined box or the original case to prevent scratches.</li>
                  <li className="flex gap-4 items-start"><span className="text-[#D4AF37] mt-1">✦</span> Keep away from perfumes, hairspray, and household chemicals as they can dull the gold's shine.</li>
                  <li className="flex gap-4 items-start"><span className="text-[#D4AF37] mt-1">✦</span> Clean periodically using a soft cloth or a specialized jewellery cleaning solution.</li>
                  <li className="flex gap-4 items-start"><span className="text-[#D4AF37] mt-1">✦</span> Have your pieces professionally inspected and cleaned by us once a year.</li>
                </ul>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <section className="mt-6 pt-6">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="font-serif text-[32px] font-medium text-[#4a0e17] whitespace-nowrap">You may also like</h2>
                <div className="flex-1 h-[1px] bg-[#E9D9C2]" />
                <Link to="/shop" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4a0e17] hover:text-[#D4AF37] transition flex items-center gap-2 whitespace-nowrap">
                  VIEW ALL COLLECTIONS <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p?._id || i} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* ── Bottom Stat Banner ── */}
          <div className="mt-10 bg-[#4a0e17] rounded-[16px] flex flex-wrap items-center justify-between py-6 px-6 lg:px-20 gap-y-10 gap-x-6 shadow-xl">
            <div className="flex items-center gap-5">
              <Award size={48} className="text-[#D4AF37] stroke-[1.2]" />
              <div>
                <p className="text-[32px] font-serif text-white leading-none mb-2">59+</p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#e2d5bd] font-semibold">Years of Trust</p>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-16 bg-[#D4AF37]/20" />

            <div className="flex items-center gap-5">
              <Shield size={48} className="text-[#D4AF37] stroke-[1.2]" />
              <div>
                <p className="text-[32px] font-serif text-white leading-none mb-2">100%</p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#e2d5bd] font-semibold">BIS Hallmark</p>
              </div>
            </div>
            <div className="hidden lg:block w-[1px] h-16 bg-[#D4AF37]/20" />

            <div className="flex items-center gap-5">
              <Users size={48} className="text-[#D4AF37] stroke-[1.2]" />
              <div>
                <p className="text-[32px] font-serif text-white leading-none mb-2">50K+</p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#e2d5bd] font-semibold">Happy Customers</p>
              </div>
            </div>
            <div className="hidden md:block w-[1px] h-16 bg-[#D4AF37]/20" />

            <div className="flex items-center gap-5">
              <div className="flex items-center">
                <Star size={36} className="text-[#D4AF37] stroke-[1.5] mr-1" />
              </div>
              <div>
                <p className="text-[32px] font-serif text-white leading-none mb-2">4.9</p>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#e2d5bd] font-semibold">Customer Rating</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Zoom Modal ── */}
      {zoomOpen && images[selectedImage]?.url && (
        <div
          className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setSelectedImage(p => Math.max(0, p - 1)); }}
                className="absolute left-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setSelectedImage(p => Math.min(images.length - 1, p + 1)); }}
                className="absolute right-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            <X size={28} />
          </button>
          <img
            src={images[selectedImage].url}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}