import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function ProductCard({ product }) {
  const { user, wishlist, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const productUrl = `/product/${product.slug || product._id}`;
  const imageUrl = product.images?.[0]?.url || product.image || '/images/gold.png';
  const price = product.pricing?.totalBeforeTax ?? product.price ?? 0;

  const isWishlisted = wishlist?.some(item => item._id === product._id);

  const handleAddToCart = (event) => {
    event.preventDefault();
    navigate('/cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      console.error("Error updating wishlist");
    }
  };

  return (
<<<<<<< Updated upstream
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
=======
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E9D9C2] bg-[#FFFDF8] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(212,175,55,0.12)]">
      <div className="relative block aspect-[4/4.5] overflow-hidden bg-[#F4EAD8]">
        <Link to={productUrl}>
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full rounded-t-[20px] object-cover transition duration-700 group-hover:scale-[1.03]"
          />
>>>>>>> Stashed changes
        </Link>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B58B22] shadow-sm">
          {product.purity || '22K'}
        </span>
        <button 
          onClick={handleWishlist}
          className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#4A0E17] hover:bg-[#4A0E17] hover:text-white transition-colors shadow-sm"
        >
          <Heart size={16} className={isWishlisted ? 'fill-current text-[#4A0E17] hover:text-white' : ''} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5 gap-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B58B22]">
          {product.metalType || 'GOLD'}
        </p>
        <Link to={productUrl}>
          <h3 className="line-clamp-2 text-[15px] font-medium text-[#2A2118] transition-colors group-hover:text-[#4A0E17] leading-snug font-serif">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-3">
          <p className="text-[16px] font-bold text-[#4A0E17]">
            {formatPrice(price)}
            <span className="ml-2 font-medium text-[12px] text-[#8a7060]">| {product.netWeight || product.weight}g</span>
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#E9D9C2] bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#4A0E17] transition-all hover:bg-[#4A0E17] hover:text-white hover:border-[#4A0E17] shadow-sm"
        >
          <ShoppingBag size={14} /> ADD TO BAG
        </button>
      </div>
    </article>
  );
}
