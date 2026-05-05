import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, MapPin, Store, CreditCard, Shield, Check, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Delivery', 'Review', 'Payment'];

/* ─── Reusable input — MUST be outside component to avoid focus loss ─── */
function FormInput({ label, value, onChange, type = 'text', required = true, placeholder = '', error }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, cartCount, cartTotal, taxAmount, taxRate, shippingCharges, grandTotal, fetchCart } = useCart();

  const [step, setStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState('home_delivery');
  const [processing, setProcessing] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (user && items.length === 0 && !processing) {
      navigate('/cart', { replace: true });
    }
  }, [user, items, processing, navigate]);

  if (!user || (items.length === 0 && !processing)) return null;

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateDelivery = () => {
    const e = {};
    if (deliveryType === 'home_delivery') {
      if (!fullName.trim()) e.fullName = 'Full name is required';
      if (!phone.trim()) e.phone = 'Phone is required';
      else if (!/^[6-9]\d{9}$/.test(phone.trim())) e.phone = 'Enter valid 10-digit number';
      if (!addressLine1.trim()) e.addressLine1 = 'Address is required';
      if (!city.trim()) e.city = 'City is required';
      if (!state.trim()) e.state = 'State is required';
      if (!pincode.trim()) e.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(pincode.trim())) e.pincode = 'Enter valid 6-digit pincode';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToReview = () => { if (validateDelivery()) setStep(1); };

  /* ─── Razorpay ─── */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      if (document.getElementById('razorpay-script')) return resolve(true);
      const s = document.createElement('script');
      s.id = 'razorpay-script';
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePayment = async () => {
    setProcessing(true);
    setStep(2);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Payment gateway failed to load.');
        setProcessing(false); setStep(1); return;
      }

      const addr = deliveryType === 'home_delivery'
        ? { fullName: fullName.trim(), phone: phone.trim(), addressLine1: addressLine1.trim(), addressLine2: addressLine2.trim(), city: city.trim(), state: state.trim(), pincode: pincode.trim() }
        : null;

      const { data } = await api.post('/orders/create-razorpay-order', { shippingAddress: addr, deliveryType });
      const { razorpayOrderId, amount, currency, keyId, prefill, orderId } = data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Vitthaldas Singhal Saraf',
        description: 'Jewellery Purchase',
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const res = await api.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            if (res.data.success) {
              await fetchCart();
              toast.success('Payment successful!');
              navigate(`/order-confirmation/${res.data.data.orderId}`, { replace: true });
            }
          } catch {
            toast.error('Payment verification failed. Contact support if debited.');
            setProcessing(false); setStep(1);
          }
        },
        prefill: { name: prefill?.name || user.name, email: prefill?.email || user.email, contact: prefill?.contact || '' },
        theme: { color: '#C5A059' },
        modal: { ondismiss: () => { toast('Payment cancelled'); setProcessing(false); setStep(1); } },
      };

      const rp = new window.Razorpay(options);
      rp.on('payment.failed', (r) => {
        toast.error('Payment failed: ' + (r.error?.description || 'Unknown'));
        setProcessing(false); setStep(1);
      });
      rp.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment.');
      setProcessing(false); setStep(1);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | Vitthaldas Singhal Saraf</title></Helmet>

      {/* ─── Step Indicator ─── */}
      <div className="bg-brand-cream/50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center justify-center gap-2 sm:gap-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand-gold text-white shadow-md' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${i <= step ? 'text-brand-dark' : 'text-gray-400'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-10 sm:w-20 h-[2px] ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* ─── Left: Main Content ─── */}
          <div className="lg:col-span-3">

            {/* STEP 0 — Delivery */}
            {step === 0 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">Delivery Details</h2>

                {/* Toggle */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <button onClick={() => setDeliveryType('home_delivery')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${deliveryType === 'home_delivery' ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <MapPin size={18} className={deliveryType === 'home_delivery' ? 'text-brand-gold' : 'text-gray-400'} />
                    <div><p className="text-sm font-semibold text-brand-dark">Home Delivery</p><p className="text-xs text-gray-500">5–7 business days</p></div>
                  </button>
                  <button onClick={() => setDeliveryType('store_pickup')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${deliveryType === 'store_pickup' ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Store size={18} className={deliveryType === 'store_pickup' ? 'text-brand-gold' : 'text-gray-400'} />
                    <div><p className="text-sm font-semibold text-brand-dark">Store Pickup</p><p className="text-xs text-gray-500">Ready in 2 hours</p></div>
                  </button>
                </div>

                {deliveryType === 'store_pickup' ? (
                  <div className="bg-brand-cream/60 border border-brand-gold/15 rounded-xl p-6 mb-6">
                    <h3 className="text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                      <Store size={16} className="text-brand-gold" /> Pickup Location
                    </h3>
                    <p className="text-sm text-gray-600">Sarafa Bazar, Lashkar, Gwalior — 474001</p>
                    <p className="text-xs text-gray-500 mt-2">Mon–Sat 10AM–9PM · Sun 11AM–7PM</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormInput label="Full Name" value={fullName} onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }} placeholder="Enter your full name" error={errors.fullName} />
                      <FormInput label="Mobile Number" value={phone} onChange={(e) => { setPhone(e.target.value); clearError('phone'); }} type="tel" placeholder="10-digit mobile number" error={errors.phone} />
                    </div>
                    <FormInput label="Address Line 1" value={addressLine1} onChange={(e) => { setAddressLine1(e.target.value); clearError('addressLine1'); }} placeholder="House/Flat No., Street" error={errors.addressLine1} />
                    <FormInput label="Address Line 2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} required={false} placeholder="Landmark, Area (optional)" />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <FormInput label="City" value={city} onChange={(e) => { setCity(e.target.value); clearError('city'); }} placeholder="City" error={errors.city} />
                      <FormInput label="State" value={state} onChange={(e) => { setState(e.target.value); clearError('state'); }} placeholder="State" error={errors.state} />
                      <FormInput label="Pincode" value={pincode} onChange={(e) => { setPincode(e.target.value); clearError('pincode'); }} placeholder="6-digit pincode" error={errors.pincode} />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                  <Link to="/cart" className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-dark transition-colors">
                    <ChevronLeft size={16} /> Back to Cart
                  </Link>
                  <button onClick={goToReview}
                    className="bg-brand-dark hover:bg-brand-gold text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-sm transition-colors duration-300">
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1 — Review */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-heading font-bold text-brand-dark mb-6">Review Your Order</h2>

                {/* Address */}
                <div className="bg-brand-cream/40 border border-gray-100 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-2">
                      {deliveryType === 'store_pickup' ? <Store size={14} /> : <MapPin size={14} />}
                      {deliveryType === 'store_pickup' ? 'Store Pickup' : 'Delivery Address'}
                    </h3>
                    <button onClick={() => setStep(0)} className="text-xs text-brand-gold hover:underline font-medium">Edit</button>
                  </div>
                  {deliveryType === 'store_pickup' ? (
                    <p className="text-sm text-gray-600">Sarafa Bazar, Lashkar, Gwalior — 474001</p>
                  ) : (
                    <div className="text-sm text-gray-600 space-y-0.5">
                      <p className="font-medium text-brand-dark">{fullName}</p>
                      <p>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ''}</p>
                      <p>{city}, {state} — {pincode}</p>
                      <p className="text-gray-500">{phone}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3">
                      <div className="w-14 h-14 bg-brand-cream rounded-lg overflow-hidden shrink-0">
                        {item.product.image
                          ? <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">💎</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-dark line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-brand-dark shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-dark transition-colors">
                    <ChevronLeft size={16} /> Edit Delivery
                  </button>
                  <button onClick={handlePayment} disabled={processing}
                    className="bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-sm transition-colors duration-300 flex items-center gap-2 disabled:opacity-60">
                    <CreditCard size={16} /> Pay {formatPrice(grandTotal)}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Processing */}
            {step === 2 && (
              <div className="text-center py-16 animate-fade-in">
                <Loader2 size={48} className="mx-auto text-brand-gold animate-spin mb-6" />
                <h2 className="text-2xl font-heading font-bold text-brand-dark mb-3">Processing Payment</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Complete the payment in the Razorpay window. Do not close this page.
                </p>
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
                  <Shield size={12} /> Secured by Razorpay · 256-bit SSL
                </div>
              </div>
            )}
          </div>

          {/* ─── Right: Summary ─── */}
          <div className="lg:col-span-2">
            <div className="bg-brand-cream/80 rounded-xl p-6 sticky top-28 border border-brand-gold/10">
              <h3 className="text-base font-heading font-semibold text-brand-dark mb-4">Price Details</h3>
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
                <div className="flex justify-between pt-4 mt-2 border-t border-brand-gold/20 text-base font-bold text-brand-dark">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500"><Shield size={12} className="text-green-500 shrink-0" /> 100% Secure Payment</div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Check size={12} className="text-green-500 shrink-0" /> BIS Hallmark Certified</div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Check size={12} className="text-green-500 shrink-0" /> 14-Day Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
