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
      <label style={{fontSize:'10px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#8a7060',fontWeight:'500',marginBottom:'6px',display:'block',fontFamily:'Jost,sans-serif'}}>
        {label} {required && <span style={{color:'#e05a5a'}}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${error ? '#e05a5a' : '#d4b896'}`,
          borderRadius: 0,
          padding: '10px 0',
          width: '100%',
          fontSize: '14px',
          color: '#1a1208',
          outline: 'none',
          fontFamily: 'Jost, sans-serif',
          transition: 'border-color 0.3s',
        }}
        onFocus={e => e.target.style.borderBottomColor = '#C5A059'}
        onBlur={e => e.target.style.borderBottomColor = error ? '#e05a5a' : '#d4b896'}
      />
      {error && <p style={{fontSize:'11px',color:'#e05a5a',marginTop:'4px'}}>{error}</p>}
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
        key: keyId, amount, currency,
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
      toast.error(err.response?.data?.message || 'Could not initiate payment.');
      setProcessing(false); setStep(1);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | Vitthaldas Singhal Saraf</title></Helmet>
      <style>{checkoutStyles}</style>

      <div className="co-page">
        {/* Header */}
        <div className="co-hero">
          <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
            <h1 className="ch" style={{fontSize:'clamp(28px,4vw,44px)',color:'#f5ede0',fontWeight:'300',marginBottom:'24px'}}>
              Secure Checkout
            </h1>
            {/* Step indicator */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0'}}>
              {STEPS.map((s, i) => (
                <div key={s} style={{display:'flex',alignItems:'center'}}>
                  <div style={{
                    display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',
                  }}>
                    <div style={{
                      width:'32px',height:'32px',borderRadius:'50%',
                      background: step > i ? '#C5A059' : step === i ? '#C5A059' : 'rgba(255,255,255,0.1)',
                      border: `1.5px solid ${step >= i ? '#C5A059' : 'rgba(197,160,89,0.3)'}`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      transition:'all 0.3s',
                    }}>
                      {step > i
                        ? <Check size={14} style={{color:'white'}} />
                        : <span style={{fontSize:'12px',color: step===i ? 'white' : 'rgba(197,160,89,0.5)',fontWeight:'600'}}>{i+1}</span>
                      }
                    </div>
                    <span style={{fontSize:'10px',letterSpacing:'0.1em',color: step >= i ? '#C5A059' : 'rgba(197,160,89,0.4)',textTransform:'uppercase',fontWeight:'500'}}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{width:'60px',height:'1px',background: step > i ? '#C5A059' : 'rgba(197,160,89,0.2)',margin:'0 8px',marginBottom:'22px',transition:'background 0.3s'}} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'48px 24px 80px'}}>
          <div className="co-layout">
            {/* Left: Steps */}
            <div style={{minWidth:0}}>

              {/* STEP 0 — Delivery */}
              {step === 0 && (
                <div className="fade-up">
                  <h2 className="ch" style={{fontSize:'26px',color:'#1a1208',fontWeight:'400',marginBottom:'24px'}}>
                    Delivery Details
                  </h2>

                  {/* Delivery type toggle */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'28px'}}>
                    {[
                      { key:'home_delivery', icon:<MapPin size={18}/>, title:'Home Delivery', sub:'5–7 business days' },
                      { key:'store_pickup', icon:<Store size={18}/>, title:'Store Pickup', sub:'Ready in 2 hours' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setDeliveryType(opt.key)}
                        className={`delivery-option ${deliveryType === opt.key ? 'active' : ''}`}
                      >
                        <div style={{color: deliveryType === opt.key ? '#C5A059' : '#8a7060',transition:'color 0.2s'}}>{opt.icon}</div>
                        <div style={{textAlign:'left'}}>
                          <p style={{fontSize:'13px',fontWeight:'600',color:'#1a1208',marginBottom:'2px'}}>{opt.title}</p>
                          <p style={{fontSize:'11px',color:'#8a7060',fontWeight:'300'}}>{opt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {deliveryType === 'store_pickup' ? (
                    <div className="pickup-card">
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
                        <Store size={16} style={{color:'#C5A059'}} />
                        <span style={{fontSize:'13px',fontWeight:'600',color:'#1a1208'}}>Pickup Location</span>
                      </div>
                      <p style={{fontSize:'13px',color:'#6a5848',fontWeight:'300',lineHeight:'1.7'}}>
                        Sarafa Bazar, Lashkar, Gwalior — 474001
                      </p>
                      <p style={{fontSize:'11px',color:'#8a7060',marginTop:'6px',fontWeight:'300'}}>
                        Mon–Sat 10AM–9PM · Sun 11AM–7PM
                      </p>
                    </div>
                  ) : (
                    <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
                        <FormInput label="Full Name" value={fullName} onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }} placeholder="Enter your full name" error={errors.fullName} />
                        <FormInput label="Mobile Number" value={phone} onChange={(e) => { setPhone(e.target.value); clearError('phone'); }} type="tel" placeholder="10-digit number" error={errors.phone} />
                      </div>
                      <FormInput label="Address Line 1" value={addressLine1} onChange={(e) => { setAddressLine1(e.target.value); clearError('addressLine1'); }} placeholder="House/Flat No., Street" error={errors.addressLine1} />
                      <FormInput label="Address Line 2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} required={false} placeholder="Landmark, Area (optional)" />
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'24px'}}>
                        <FormInput label="City" value={city} onChange={(e) => { setCity(e.target.value); clearError('city'); }} placeholder="City" error={errors.city} />
                        <FormInput label="State" value={state} onChange={(e) => { setState(e.target.value); clearError('state'); }} placeholder="State" error={errors.state} />
                        <FormInput label="Pincode" value={pincode} onChange={(e) => { setPincode(e.target.value); clearError('pincode'); }} placeholder="6-digit" error={errors.pincode} />
                      </div>
                    </div>
                  )}

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'40px',paddingTop:'24px',borderTop:'1px solid #ede0d0'}}>
                    <Link to="/cart" style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'#8a7060',textDecoration:'none',transition:'color 0.2s'}}
                      onMouseOver={e=>e.currentTarget.style.color='#1a1208'} onMouseOut={e=>e.currentTarget.style.color='#8a7060'}>
                      <ChevronLeft size={14} /> Back to Cart
                    </Link>
                    <button onClick={goToReview} className="gold-action-btn">
                      Continue to Review
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1 — Review */}
              {step === 1 && (
                <div className="fade-up">
                  <h2 className="ch" style={{fontSize:'26px',color:'#1a1208',fontWeight:'400',marginBottom:'24px'}}>
                    Review Your Order
                  </h2>

                  {/* Address summary */}
                  <div className="review-card" style={{marginBottom:'20px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                      <span style={{fontSize:'10px',fontWeight:'600',letterSpacing:'0.2em',textTransform:'uppercase',color:'#1a1208',display:'flex',alignItems:'center',gap:'6px'}}>
                        {deliveryType === 'store_pickup' ? <Store size={12} style={{color:'#C5A059'}} /> : <MapPin size={12} style={{color:'#C5A059'}} />}
                        {deliveryType === 'store_pickup' ? 'Store Pickup' : 'Delivery Address'}
                      </span>
                      <button onClick={() => setStep(0)} style={{fontSize:'11px',color:'#C5A059',background:'none',border:'none',cursor:'pointer',fontFamily:'Jost,sans-serif',fontWeight:'500'}}>
                        Edit
                      </button>
                    </div>
                    {deliveryType === 'store_pickup' ? (
                      <p style={{fontSize:'13px',color:'#6a5848',fontWeight:'300'}}>Sarafa Bazar, Lashkar, Gwalior — 474001</p>
                    ) : (
                      <div style={{fontSize:'13px',color:'#6a5848',lineHeight:'1.7',fontWeight:'300'}}>
                        <p style={{fontWeight:'500',color:'#1a1208'}}>{fullName}</p>
                        <p>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ''}</p>
                        <p>{city}, {state} — {pincode}</p>
                        <p style={{color:'#8a7060'}}>{phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'28px'}}>
                    {items.map((item) => (
                      <div key={item._id} style={{display:'flex',alignItems:'center',gap:'14px',background:'white',border:'1px solid #ede0d0',padding:'14px'}}>
                        <div style={{width:'52px',height:'52px',background:'#f5ede0',border:'1px solid #ede0d0',flexShrink:0,overflow:'hidden'}}>
                          {item.product.image
                            ? <img src={item.product.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                            : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',opacity:0.15,fontSize:'18px'}}>💎</div>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:'13px',fontWeight:'500',color:'#1a1208',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'2px'}}>{item.product.name}</p>
                          <p style={{fontSize:'11px',color:'#8a7060',fontWeight:'300'}}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{fontSize:'14px',fontWeight:'600',color:'#1a1208',flexShrink:0}}>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'24px',borderTop:'1px solid #ede0d0'}}>
                    <button onClick={() => setStep(0)} style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'#8a7060',background:'none',border:'none',cursor:'pointer',fontFamily:'Jost,sans-serif',transition:'color 0.2s'}}
                      onMouseOver={e=>e.currentTarget.style.color='#1a1208'} onMouseOut={e=>e.currentTarget.style.color='#8a7060'}>
                      <ChevronLeft size={14} /> Edit Delivery
                    </button>
                    <button onClick={handlePayment} disabled={processing} className="gold-action-btn" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <CreditCard size={15} /> Pay {formatPrice(grandTotal)}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 — Processing */}
              {step === 2 && (
                <div className="fade-up" style={{textAlign:'center',padding:'64px 24px'}}>
                  <div style={{position:'relative',width:'64px',height:'64px',margin:'0 auto 28px'}}>
                    <div style={{width:'64px',height:'64px',border:'2px solid rgba(197,160,89,0.2)',borderRadius:'50%',position:'absolute'}} />
                    <div style={{width:'64px',height:'64px',border:'2px solid transparent',borderTopColor:'#C5A059',borderRadius:'50%',position:'absolute',animation:'spin 1s linear infinite'}} />
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <CreditCard size={22} style={{color:'#C5A059'}} />
                    </div>
                  </div>
                  <h2 className="ch" style={{fontSize:'30px',color:'#1a1208',fontWeight:'400',marginBottom:'10px'}}>Processing Payment</h2>
                  <p style={{color:'#8a7060',fontSize:'13px',fontWeight:'300',maxWidth:'320px',margin:'0 auto 20px',lineHeight:'1.7'}}>
                    Complete the payment in the Razorpay window. Do not close this page.
                  </p>
                  <div style={{display:'inline-flex',alignItems:'center',gap:'8px',fontSize:'11px',color:'#8a7060',background:'rgba(197,160,89,0.06)',padding:'8px 16px',border:'1px solid rgba(197,160,89,0.2)'}}>
                    <Shield size={12} style={{color:'#3a9a5c'}} /> Secured by Razorpay · 256-bit SSL
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary */}
            <div className="co-summary">
              <div style={{height:'3px',background:'linear-gradient(90deg,#C5A059,#e8c97a,#C5A059)',margin:'-28px -28px 24px'}} />
              <h3 className="ch" style={{fontSize:'20px',color:'#1a1208',fontWeight:'400',marginBottom:'20px'}}>Price Details</h3>

              <div style={{display:'flex',flexDirection:'column',gap:'12px',fontSize:'13px',borderBottom:'1px solid #ede0d0',paddingBottom:'16px',marginBottom:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>Subtotal ({cartCount} items)</span>
                  <span style={{fontWeight:'500',color:'#1a1208'}}>{formatPrice(cartTotal)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>GST ({taxRate}%)</span>
                  <span style={{fontWeight:'500',color:'#1a1208'}}>{formatPrice(taxAmount)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>Shipping</span>
                  <span style={{fontWeight:'500',color: shippingCharges === 0 ? '#3a9a5c' : '#1a1208'}}>
                    {shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)}
                  </span>
                </div>
              </div>

              <div style={{display:'flex',justifyContent:'space-between',fontSize:'16px',fontWeight:'700',color:'#1a1208',marginBottom:'24px'}}>
                <span>Total</span>
                <span style={{fontSize:'18px'}}>{formatPrice(grandTotal)}</span>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:'8px',paddingTop:'16px',borderTop:'1px solid #ede0d0'}}>
                {[
                  [Shield, '100% Secure Payment', '#3a9a5c'],
                  [Check, 'BIS Hallmark Certified', '#3a9a5c'],
                  [Check, '14-Day Returns', '#3a9a5c'],
                ].map(([Icon, text, color]) => (
                  <div key={text} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',color:'#6a5848',fontWeight:'300'}}>
                    <Icon size={12} style={{color, flexShrink:0}} /> {text}
                  </div>
                ))}
              </div>

              {/* Items preview */}
              {items.length > 0 && (
                <div style={{marginTop:'20px',paddingTop:'16px',borderTop:'1px solid #ede0d0'}}>
                  <p style={{fontSize:'10px',letterSpacing:'0.15em',textTransform:'uppercase',color:'#8a7060',marginBottom:'12px',fontWeight:'600'}}>
                    Your Items
                  </p>
                  {items.slice(0,3).map(item => (
                    <div key={item._id} style={{display:'flex',gap:'10px',alignItems:'center',marginBottom:'10px'}}>
                      <div style={{width:'40px',height:'40px',background:'#f5ede0',border:'1px solid #ede0d0',overflow:'hidden',flexShrink:0}}>
                        {item.product.image
                          ? <img src={item.product.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                          : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',opacity:0.15,fontSize:'14px'}}>💎</div>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:'11px',fontWeight:'500',color:'#1a1208',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.product.name}</p>
                        <p style={{fontSize:'10px',color:'#8a7060',fontWeight:'300'}}>×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && <p style={{fontSize:'11px',color:'#8a7060',fontWeight:'300'}}>+{items.length - 3} more items</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const checkoutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
  .co-page { font-family: 'Jost', sans-serif; background: #fdf8f2; }
  .ch { font-family: 'Cormorant Garamond', serif; }
  .co-hero {
    background: linear-gradient(160deg, #1a0e04 0%, #2d1a08 60%, #3a2010 100%);
    padding: 56px 24px; position: relative; overflow: hidden;
  }
  .co-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(197,160,89,0.07), transparent 70%);
  }
  .co-layout { display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start; }
  @media (max-width: 900px) { .co-layout { grid-template-columns: 1fr; } }
  .co-summary {
    background: white; border: 1px solid #ede0d0; padding: 28px;
    position: sticky; top: 100px;
  }
  .delivery-option {
    display: flex; gap: 12px; align-items: center;
    padding: 16px; border: 1.5px solid #ede0d0;
    background: white; cursor: pointer; text-align: left;
    transition: all 0.2s; font-family: 'Jost', sans-serif;
  }
  .delivery-option:hover { border-color: rgba(197,160,89,0.5); }
  .delivery-option.active { border-color: #C5A059; background: rgba(197,160,89,0.04); box-shadow: 0 0 0 1px #C5A059; }
  .pickup-card {
    background: rgba(197,160,89,0.05); border: 1px solid rgba(197,160,89,0.2);
    padding: 20px;
  }
  .review-card {
    background: rgba(245,237,224,0.5); border: 1px solid #ede0d0; padding: 20px;
  }
  .gold-action-btn {
    background: linear-gradient(135deg, #C5A059 0%, #e8c97a 50%, #C5A059 100%);
    background-size: 200% auto; color: white;
    border: none; cursor: pointer; padding: 14px 28px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    font-family: 'Jost', sans-serif; transition: all 0.4s;
    box-shadow: 0 4px 16px rgba(197,160,89,0.3);
  }
  .gold-action-btn:hover { background-position: right center; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(197,160,89,0.45); }
  .gold-action-btn:disabled { opacity: 0.5; transform: none; cursor: default; }
  .fade-up { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;