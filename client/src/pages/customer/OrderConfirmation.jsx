import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Package, MapPin, Store, Clock, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice, formatDate } from '../../utils/helpers';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data.data);
      } catch (err) {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Loader2 size={40} className="mx-auto text-brand-gold animate-spin mb-4" />
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Helmet><title>Order Not Found | Vitthaldas Singhal Saraf</title></Helmet>
        <h2 className="text-2xl font-heading font-bold text-brand-dark mb-4">Order Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'We could not find this order.'}</p>
        <Link to="/shop" className="text-brand-gold hover:underline font-medium">Continue Shopping</Link>
      </div>
    );
  }

  const isStorePickup = order.deliveryType === 'store_pickup' ||
    order.notes?.includes('Store Pickup') ||
    order.shippingAddress?.addressLine1?.includes('Sarafa Bazar');

  return (
    <>
      <Helmet><title>Order Confirmed | Vitthaldas Singhal Saraf</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* ──── Success Header ──── */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-brand-dark mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500">Thank you for shopping with Vitthaldas Singhal Saraf</p>
        </div>

        {/* ──── Order Card ──── */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-8 animate-fade-in">
          {/* Header */}
          <div className="bg-brand-cream/60 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Order Number</p>
                <p className="text-lg font-bold text-brand-dark font-heading">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Date</p>
                <p className="text-sm font-medium text-brand-dark">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4 flex items-center gap-2">
              <Package size={14} className="text-brand-gold" /> Items Ordered
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-brand-cream rounded-lg overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg opacity-20">💎</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-dark line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.metalType} · {item.purity} · {item.weight}g · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-brand-dark shrink-0">{formatPrice(item.itemPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST ({order.taxRate}%)</span><span>{formatPrice(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={order.shippingCharges === 0 ? 'text-green-600' : ''}>
                  {order.shippingCharges === 0 ? 'FREE' : formatPrice(order.shippingCharges)}
                </span>
              </div>
              <div className="flex justify-between pt-3 mt-2 border-t border-gray-200 text-base font-bold text-brand-dark">
                <span>Total Paid</span><span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-3 flex items-center gap-2">
              {isStorePickup ? <Store size={14} className="text-brand-gold" /> : <MapPin size={14} className="text-brand-gold" />}
              {isStorePickup ? 'Store Pickup' : 'Delivery Address'}
            </h3>
            {isStorePickup ? (
              <div>
                <p className="text-sm text-gray-600">Sarafa Bazar, Lashkar, Gwalior — 474001</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-brand-gold bg-brand-gold/5 px-3 py-2 rounded-lg w-fit">
                  <Clock size={12} /> Ready for pickup in approximately 2 hours
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-brand-dark">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}
                  {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                </p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                <p>{order.shippingAddress?.phone}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-brand-gold bg-brand-gold/5 px-3 py-2 rounded-lg w-fit">
                  <Clock size={12} /> Estimated delivery: 5–7 business days
                </div>
              </div>
            )}
          </div>

          {/* Payment Status */}
          <div className="px-6 py-4 bg-green-50/50 border-t border-green-100">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="font-medium text-green-700">Payment {order.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'}</span>
              {order.razorpayPaymentId && (
                <span className="text-xs text-gray-400 ml-2">ID: {order.razorpayPaymentId}</span>
              )}
            </div>
          </div>
        </div>

        {/* ──── Action Buttons ──── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop"
            className="flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand-gold text-white font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-sm transition-colors duration-300">
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <Link to="/orders"
            className="flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-gold text-brand-dark hover:text-brand-gold font-semibold text-sm uppercase tracking-wider px-8 py-3.5 rounded-sm transition-all">
            View All Orders
          </Link>
        </div>
      </div>
    </>
  );
}
