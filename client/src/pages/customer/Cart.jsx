import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const gstAmount = Math.round(cartTotal * 0.03);
  const grandTotal = cartTotal + gstAmount;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Helmet><title>Cart | Vitthaldas Singhal Saraf</title></Helmet>
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-heading font-bold text-brand-dark mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some beautiful jewellery to get started</p>
        <Link to="/shop" className="bg-brand-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-gold-dark transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Cart ({items.length}) | Vitthaldas Singhal Saraf</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold text-brand-dark mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
                <div className="w-24 h-24 bg-brand-cream rounded-lg overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="text-3xl opacity-30">💎</span></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-brand-dark">{item.name}</h3>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{item.metalType} · {item.weight}g</p>
                  <p className="text-lg font-bold text-brand-dark mt-2">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.product)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 rounded-l-lg">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 rounded-r-lg">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-brand-cream rounded-xl p-6 h-fit sticky top-28">
            <h3 className="font-semibold text-brand-dark mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between"><span>GST (3%)</span><span>{formatPrice(gstAmount)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
              <div className="flex justify-between pt-3 border-t border-gray-300 font-bold text-brand-dark text-base">
                <span>Total</span><span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block text-center bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-3.5 rounded-lg mt-6 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="block text-center text-sm text-brand-gold hover:underline mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
