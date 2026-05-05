import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Cart() {
  const { user } = useAuth();
  const {
    items, loading, cartCount, cartTotal, taxAmount, taxRate,
    shippingCharges, freeShippingThreshold, grandTotal,
    removeFromCart, updateQuantity,
  } = useCart();
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Guest → login redirect
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Helmet><title>Cart | Vitthaldas Singhal Saraf</title></Helmet>
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-heading font-bold text-brand-dark mb-2">Please sign in to view your cart</h2>
        <p className="text-gray-500 mb-6">Your cart is saved to your account so you can access it anywhere</p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-brand-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-gold-dark transition-colors">
          Sign In <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Loading skeleton
  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Helmet><title>Cart | Vitthaldas Singhal Saraf</title></Helmet>
        <div className="h-10 w-48 bg-gray-100 rounded animate-shimmer mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg animate-shimmer shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-100 rounded animate-shimmer w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-shimmer w-1/3" />
                  <div className="h-5 bg-gray-100 rounded animate-shimmer w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-6 h-64 animate-shimmer" />
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Helmet><title>Cart | Vitthaldas Singhal Saraf</title></Helmet>
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-brand-cream flex items-center justify-center">
          <ShoppingBag size={40} className="text-brand-gold/40" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-brand-dark mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Explore our exquisite jewellery collection and find something special
        </p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-3.5 rounded-sm font-semibold text-sm uppercase tracking-wider hover:bg-brand-gold transition-colors duration-300">
          Browse Collection <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return; // min 1, handled by UI
    setUpdating(itemId);
    await updateQuantity(itemId, newQty);
    setUpdating(null);
  };

  const handleRemove = async (itemId, name) => {
    if (!confirm(`Remove "${name}" from your cart?`)) return;
    setRemoving(itemId);
    await removeFromCart(itemId);
    toast.success('Item removed from cart');
    setRemoving(null);
  };

  const handleMinusClick = async (item) => {
    if (item.quantity <= 1) {
      // At quantity 1, minus = "remove" confirmation
      handleRemove(item._id, item.product.name);
    } else {
      handleQuantityChange(item._id, item.quantity - 1);
    }
  };

  return (
    <>
      <Helmet><title>{`Cart (${cartCount}) | Vitthaldas Singhal Saraf`}</title></Helmet>

      <div className="bg-brand-cream/40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-3xl font-heading font-bold text-brand-dark">Shopping Cart</h1>
          <p className="text-sm text-brand-muted mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ──── Cart Items ──── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isRemoving = removing === item._id;
              const isUpdating = updating === item._id;
              const rowTotal = item.price * item.quantity;

              return (
                <div
                  key={item._id}
                  className={`flex gap-4 bg-white border border-gray-100 rounded-xl p-4 transition-all duration-300 ${
                    isRemoving ? 'opacity-40 scale-[0.98]' : ''
                  }`}
                >
                  {/* Image */}
                  <Link to={`/product/${item.product.slug || item.product._id}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-cream rounded-lg overflow-hidden shrink-0">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl opacity-30">💎</span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.slug || item.product._id}`}
                      className="font-semibold text-sm text-brand-dark hover:text-brand-gold transition-colors line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {item.product.metalType} · {item.product.purity}
                      {item.product.netWeight ? ` · ${item.product.netWeight}g Net` : ''}
                    </p>
                    <p className="text-base font-bold text-brand-dark mt-2">{formatPrice(item.price)}</p>

                    {!item.product.inStock && (
                      <p className="text-xs text-red-500 mt-1 font-medium">Currently out of stock</p>
                    )}
                  </div>

                  {/* Quantity + Actions */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => handleRemove(item._id, item.product.name)}
                      disabled={isRemoving}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleMinusClick(item)}
                        disabled={isUpdating}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-40"
                      >
                        <Minus size={13} />
                      </button>
                      <span className={`text-sm font-semibold w-8 text-center ${isUpdating ? 'opacity-40' : ''}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={isUpdating}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-40"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">{formatPrice(rowTotal)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ──── Order Summary ──── */}
          <div className="lg:col-span-1">
            <div className="bg-brand-cream/80 rounded-xl p-6 sticky top-28 border border-brand-gold/10">
              <h3 className="text-lg font-heading font-semibold text-brand-dark mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-brand-dark">{formatPrice(cartTotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>GST ({taxRate}%)</span>
                  <span className="font-medium text-brand-dark">{formatPrice(taxAmount)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shippingCharges === 0 ? 'text-green-600' : 'text-brand-dark'}`}>
                    {shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)}
                  </span>
                </div>

                {shippingCharges > 0 && (
                  <p className="text-xs text-gray-400 italic">
                    Free shipping on orders above {formatPrice(freeShippingThreshold)}
                  </p>
                )}

                <div className="flex justify-between pt-4 mt-2 border-t border-brand-gold/20 text-base font-bold text-brand-dark">
                  <span>Grand Total</span>
                  <span className="text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-brand-dark hover:bg-brand-gold text-white font-bold text-sm uppercase tracking-wider py-4 rounded-sm transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <Link to="/shop" className="block text-center text-sm text-brand-gold hover:underline mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
