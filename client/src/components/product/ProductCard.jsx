import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2, Eye } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const price = product.pricing?.totalBeforeTax || 0;

  const primaryImage = product.images?.[0]?.url;
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast('Please login to add items to cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    const success = await addToCart(product._id);
    if (success) toast.success('Added to cart');
    else toast.error('Failed to add to cart');
    setAdding(false);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Purity display badge
  const purityLabel = product.purity || '';

  return (
    <div
      className="group flex flex-col h-full bg-white transition-all duration-500 overflow-hidden border border-gray-100 hover:border-brand-gold/40 hover:shadow-lg rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link 
        to={`/product/${product.slug || product._id}`} 
        className="block shrink-0 relative w-full overflow-hidden bg-brand-rose"
        style={{ aspectRatio: '3 / 4' }}
      >
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ease-out ${
                isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-100' : 'opacity-100 group-hover:scale-[1.06]'
              }`}
              loading="lazy"
            />
            {secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ease-out ${
                  isHovered ? 'opacity-100 scale-[1.06]' : 'opacity-0 scale-100'
                }`}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-rose to-brand-cream/80">
            <span className="text-4xl font-heading text-brand-gold/10 font-bold tracking-widest">VSS</span>
          </div>
        )}

        {/* Purity badge - top left */}
        {purityLabel && (
          <div className="absolute top-3 left-3 z-10">
            <span className="badge badge-gold" style={{ fontSize: '8px', letterSpacing: '0.12em' }}>
              {purityLabel}
            </span>
          </div>
        )}

        {/* Action buttons - top right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 backdrop-blur-sm ${
              wishlisted
                ? 'bg-red-50 text-red-500 border border-red-200'
                : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-white/50'
            }`}
            title="Add to Wishlist"
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/product/${product.slug || product._id}`); }}
            className="w-9 h-9 rounded-full flex items-center justify-center shadow-md bg-white/90 text-gray-400 hover:text-brand-gold border border-white/50 transition-all duration-300 backdrop-blur-sm"
            title="Quick View"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Details Area */}
      <div className="flex flex-col flex-1 p-4 pt-3.5">
        <Link to={`/product/${product.slug || product._id}`} className="flex flex-col text-left mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold mb-1.5">
            {product.metalType}
          </span>
          <span className="text-[14px] font-heading font-medium text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-brand-gold-dark transition-colors duration-300">
            {product.name}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[16px] font-bold text-gray-900 leading-none">
              {formatPrice(price)}
            </span>
            {product.netWeight && (
              <span className="text-[11px] text-gray-400 font-light leading-none">
                · {product.netWeight}g
              </span>
            )}
          </div>
        </Link>

        {/* Full-width Button */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-auto w-full border border-brand-dark/80 text-brand-dark bg-transparent hover:bg-brand-dark hover:text-white transition-all duration-300 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] outline-none disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.97]"
          style={{ borderRadius: '4px' }}
        >
          {adding ? <><Loader2 size={13} className="animate-spin" /> ADDING...</> : <><ShoppingBag size={13} /> ADD TO BAG</>}
        </button>
      </div>
    </div>
  );
}
