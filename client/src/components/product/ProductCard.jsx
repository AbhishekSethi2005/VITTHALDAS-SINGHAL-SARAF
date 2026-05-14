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
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E9D9C2] bg-[#FFFDF8] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(212,175,55,0.12)]">
      <div className="relative block aspect-[4/4.5] overflow-hidden bg-[#F4EAD8]">
        <Link to={productUrl}>
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full rounded-t-[20px] object-cover transition duration-700 group-hover:scale-[1.03]"
          />
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
