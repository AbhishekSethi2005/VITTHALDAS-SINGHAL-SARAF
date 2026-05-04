import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const price = product.pricing?.totalBeforeTax || 0;

  const primaryImage = product.images?.[0]?.url;
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product: product._id,
      name: product.name,
      image: primaryImage || '',
      price,
      metalType: product.metalType,
      weight: product.netWeight,
    });
    toast.success('Added to cart');
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
    <Link
      to={`/product/${product.slug || product._id}`}
      className="group block relative bg-white transition-all duration-500 card-hover rounded-sm overflow-hidden border border-gray-100 hover:border-brand-gold/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-brand-cream overflow-hidden">
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-100' : 'opacity-100 group-hover:scale-105'
              }`}
              loading="lazy"
            />
            {secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gold/8 to-brand-gold/3">
            <span className="text-5xl font-heading text-brand-gold/15 font-bold">VSS</span>
          </div>
        )}

        {/* Purity Badge — top left */}
        {purityLabel && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/90 backdrop-blur-sm text-brand-dark text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-sm shadow-sm">
              {purityLabel}
            </span>
          </div>
        )}

        {/* Featured Badge — top right (only if featured) */}
        {product.isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-brand-gold/90 backdrop-blur-sm text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-sm">
              Featured
            </span>
          </div>
        )}

        {/* Wishlist Button — appears on hover, top-right (shifts down if featured) */}
        <div className={`absolute z-10 transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ${product.isFeatured ? 'top-10 right-3' : 'top-3 right-3'}`}>
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
              wishlisted
                ? 'bg-red-50 text-red-500'
                : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Quick Add Bar */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <button
            onClick={handleAddToCart}
            className="w-full bg-brand-dark/95 backdrop-blur-sm hover:bg-brand-gold text-white text-[10px] font-bold uppercase tracking-[0.15em] py-3.5 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={13} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 sm:p-6 text-center flex flex-col h-full justify-between">
        <div>
          <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.25em] mb-2.5">
            {product.metalType}
            {purityLabel && (
              <>
                <span className="mx-2 opacity-30">•</span>
                {purityLabel}
              </>
            )}
          </p>
          <h3 className="text-sm font-heading font-medium text-brand-dark line-clamp-2 mb-3 group-hover:text-brand-gold-dark transition-colors duration-300">
            {product.name}
          </h3>
        </div>
        <div className="flex flex-col items-center mt-2 pt-3 border-t border-gray-50">
          <p className="text-base sm:text-lg font-semibold text-brand-charcoal tracking-wide">
            {formatPrice(price)}
          </p>
          {product.netWeight && (
            <p className="text-[10px] text-gray-400 font-medium tracking-wider mt-1">
              {product.netWeight}g Net Wt.
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
