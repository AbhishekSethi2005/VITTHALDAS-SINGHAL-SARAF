import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
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
      className="group flex flex-col h-full bg-white transition-all duration-300 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg hover:border-gray-300 relative box-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link 
        to={`/product/${product.slug || product._id}`} 
        className="block shrink-0"
        style={{ aspectRatio: '3 / 4', width: '100%', overflow: 'hidden', backgroundColor: '#f5f0eb', position: 'relative' }}
      >
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              className={`transition-all duration-700 ease-out ${
                isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-100' : 'opacity-100 group-hover:scale-105'
              }`}
              loading="lazy"
            />
            {secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                className={`transition-all duration-700 ease-out ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-3xl font-heading text-gray-300 font-bold tracking-widest">VSS</span>
          </div>
        )}

        {/* Wishlist Button — top-right */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
              wishlisted
                ? 'bg-red-50 text-red-500'
                : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>

      {/* Details Area */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/product/${product.slug || product._id}`} className="flex flex-col text-left mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1.5">
            {product.metalType}
          </span>
          <span className="text-[15px] font-heading font-medium text-gray-900 mb-2 leading-tight">
            {product.name}
          </span>
          <div className="flex flex-col mt-1">
            <span className="text-[16px] font-bold text-gray-900 leading-none">
              {formatPrice(price)}
            </span>
            {product.netWeight && (
              <span className="text-[12px] text-gray-500 font-light mt-1.5 leading-none">
                {product.netWeight}g Net Wt.
              </span>
            )}
          </div>
        </Link>

        {/* Full-width Button */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-auto w-full border border-brand-dark text-brand-dark bg-transparent hover:bg-brand-dark hover:text-white transition-colors duration-300 py-3 text-[12px] font-bold uppercase tracking-widest rounded-sm outline-none disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {adding ? <><Loader2 size={14} className="animate-spin" /> ADDING...</> : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
