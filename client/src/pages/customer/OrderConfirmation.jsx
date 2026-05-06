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
      <>
        <style>{ocStyles}</style>
        <div className="oc-page" style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px'}}>
          <Loader2 size={36} style={{color:'#C5A059',animation:'spin 1s linear infinite'}} />
          <p style={{color:'#8a7060',fontSize:'13px',fontWeight:'300'}}>Loading order details...</p>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Helmet><title>Order Not Found | Vitthaldas Singhal Saraf</title></Helmet>
        <style>{ocStyles}</style>
        <div className="oc-page" style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px',padding:'40px 24px',textAlign:'center'}}>
          <h2 className="ch" style={{fontSize:'32px',color:'#1a1208',fontWeight:'400'}}>Order Not Found</h2>
          <p style={{color:'#8a7060',fontSize:'14px',fontWeight:'300'}}>{error || 'We could not find this order.'}</p>
          <Link to="/shop" className="gold-link" style={{marginTop:'8px'}}>Continue Shopping →</Link>
        </div>
      </>
    );
  }

  const isStorePickup = order.deliveryType === 'store_pickup' ||
    order.notes?.includes('Store Pickup') ||
    order.shippingAddress?.addressLine1?.includes('Sarafa Bazar');

  return (
    <>
      <Helmet><title>Order Confirmed | Vitthaldas Singhal Saraf</title></Helmet>
      <style>{ocStyles}</style>

      <div className="oc-page">
        {/* Success Hero */}
        <div className="oc-hero">
          <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
            <div className="success-ring">
              <CheckCircle2 size={36} style={{color:'white'}} />
            </div>
            <h1 className="ch" style={{fontSize:'clamp(32px,4vw,48px)',color:'#f5ede0',fontWeight:'300',marginBottom:'10px',marginTop:'20px'}}>
              Order Confirmed
            </h1>
            <div style={{height:'1px',background:'linear-gradient(90deg,transparent,#C5A059,transparent)',width:'70px',margin:'0 auto 14px'}} />
            <p style={{color:'#8a7060',fontSize:'13px',fontWeight:'300'}}>
              Thank you for shopping with Vitthaldas Singhal Saraf
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'48px 24px 80px'}}>
          {/* Order Card */}
          <div className="oc-card fade-up">
            {/* Card header */}
            <div className="oc-card-header">
              <div>
                <p style={{fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#8a7060',marginBottom:'4px'}}>Order Number</p>
                <p className="ch" style={{fontSize:'22px',color:'#1a1208',fontWeight:'600',letterSpacing:'0.05em'}}>{order.orderNumber}</p>
              </div>
              <div style={{textAlign:'right'}}>
                <p style={{fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#8a7060',marginBottom:'4px'}}>Date</p>
                <p style={{fontSize:'13px',fontWeight:'500',color:'#1a1208'}}>{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {/* Items */}
            <div className="oc-section">
              <h3 className="section-label">
                <Package size={13} style={{color:'#C5A059'}} />
                Items Ordered
              </h3>
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'14px'}}>
                    <div style={{width:'56px',height:'56px',background:'#f5ede0',border:'1px solid #ede0d0',flexShrink:0,overflow:'hidden'}}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      ) : (
                        <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',opacity:0.15,fontSize:'20px'}}>💎</div>
                      )}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:'14px',fontWeight:'500',color:'#1a1208',marginBottom:'3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</p>
                      <p style={{fontSize:'11px',color:'#8a7060',fontWeight:'300'}}>
                        {item.metalType} · {item.purity} · {item.weight}g · Qty: {item.quantity}
                      </p>
                    </div>
                    <p style={{fontSize:'14px',fontWeight:'600',color:'#1a1208',flexShrink:0}}>{formatPrice(item.itemPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="oc-section">
              <div style={{display:'flex',flexDirection:'column',gap:'10px',fontSize:'13px'}}>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>Subtotal</span><span style={{fontWeight:'500',color:'#1a1208'}}>{formatPrice(order.subtotal)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>GST ({order.taxRate}%)</span><span style={{fontWeight:'500',color:'#1a1208'}}>{formatPrice(order.taxAmount)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>Shipping</span>
                  <span style={{fontWeight:'500',color: order.shippingCharges === 0 ? '#3a9a5c' : '#1a1208'}}>
                    {order.shippingCharges === 0 ? 'FREE' : formatPrice(order.shippingCharges)}
                  </span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',paddingTop:'14px',marginTop:'4px',borderTop:'1px solid #ede0d0',fontSize:'16px',fontWeight:'700',color:'#1a1208'}}>
                  <span>Total Paid</span><span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="oc-section">
              <h3 className="section-label">
                {isStorePickup ? <Store size={13} style={{color:'#C5A059'}} /> : <MapPin size={13} style={{color:'#C5A059'}} />}
                {isStorePickup ? 'Store Pickup' : 'Delivery Address'}
              </h3>
              {isStorePickup ? (
                <div>
                  <p style={{fontSize:'13px',color:'#6a5848',lineHeight:'1.6',fontWeight:'300'}}>Sarafa Bazar, Lashkar, Gwalior — 474001</p>
                  <div style={{display:'inline-flex',alignItems:'center',gap:'6px',marginTop:'12px',fontSize:'11px',color:'#C5A059',background:'rgba(197,160,89,0.08)',padding:'6px 12px',border:'1px solid rgba(197,160,89,0.2)'}}>
                    <Clock size={11} /> Ready for pickup in ~2 hours
                  </div>
                </div>
              ) : (
                <div style={{fontSize:'13px',color:'#6a5848',lineHeight:'1.8',fontWeight:'300'}}>
                  <p style={{fontWeight:'500',color:'#1a1208'}}>{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.addressLine1}{order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                  <p style={{color:'#8a7060'}}>{order.shippingAddress?.phone}</p>
                  <div style={{display:'inline-flex',alignItems:'center',gap:'6px',marginTop:'12px',fontSize:'11px',color:'#C5A059',background:'rgba(197,160,89,0.08)',padding:'6px 12px',border:'1px solid rgba(197,160,89,0.2)'}}>
                    <Clock size={11} /> Estimated delivery: 5–7 business days
                  </div>
                </div>
              )}
            </div>

            {/* Payment Status */}
            <div style={{padding:'16px 28px',background:'rgba(58,154,92,0.05)',borderTop:'1px solid rgba(58,154,92,0.15)',display:'flex',alignItems:'center',gap:'10px',fontSize:'13px'}}>
              <CheckCircle2 size={16} style={{color:'#3a9a5c'}} />
              <span style={{fontWeight:'500',color:'#2d7a4a'}}>
                Payment {order.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'}
              </span>
              {order.razorpayPaymentId && (
                <span style={{fontSize:'11px',color:'#8a7060',marginLeft:'8px',fontFamily:'monospace'}}>
                  ID: {order.razorpayPaymentId}
                </span>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',marginTop:'8px'}} className="fade-up">
            <Link to="/shop" className="dark-action-btn">
              Continue Shopping <ArrowRight size={14} />
            </Link>
            <Link to="/orders" className="outline-action-btn">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const ocStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
  .oc-page { font-family: 'Jost', sans-serif; background: #fdf8f2; }
  .ch { font-family: 'Cormorant Garamond', serif; }
  .oc-hero {
    background: linear-gradient(160deg, #1a0e04 0%, #2d1a08 60%, #3a2010 100%);
    padding: 64px 24px 56px; position: relative; overflow: hidden; text-align: center;
  }
  .oc-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(197,160,89,0.08), transparent 70%);
    pointer-events: none;
  }
  .success-ring {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #3a9a5c, #4ab86e);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto;
    box-shadow: 0 0 0 8px rgba(58,154,92,0.15), 0 0 0 16px rgba(58,154,92,0.07);
    animation: successPulse 2s ease-in-out infinite;
  }
  @keyframes successPulse {
    0%,100% { box-shadow: 0 0 0 8px rgba(58,154,92,0.15), 0 0 0 16px rgba(58,154,92,0.07); }
    50% { box-shadow: 0 0 0 10px rgba(58,154,92,0.2), 0 0 0 20px rgba(58,154,92,0.05); }
  }
  .oc-card {
    background: white; border: 1px solid #ede0d0; overflow: hidden; margin-bottom: 28px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.05);
  }
  .oc-card::before {
    content: ''; display: block; height: 3px;
    background: linear-gradient(90deg, #C5A059, #e8c97a, #C5A059);
  }
  .oc-card-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 24px 28px; background: rgba(245,237,224,0.5);
    border-bottom: 1px solid #ede0d0;
  }
  .oc-section {
    padding: 24px 28px; border-bottom: 1px solid #ede0d0;
  }
  .section-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; color: #1a1208; margin-bottom: 16px;
    font-family: 'Jost', sans-serif;
  }
  .dark-action-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #1a1208; color: white; text-decoration: none;
    padding: 14px 32px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 500; transition: background 0.3s; font-family: 'Jost', sans-serif;
  }
  .dark-action-btn:hover { background: #C5A059; }
  .outline-action-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: none; border: 1px solid #d4c0b0; color: #3a2c20; text-decoration: none;
    padding: 14px 32px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 500; transition: all 0.3s; font-family: 'Jost', sans-serif;
  }
  .outline-action-btn:hover { border-color: #C5A059; color: #C5A059; }
  .gold-link { color: #C5A059; font-size: 14px; font-weight: 500; text-decoration: none; }
  .gold-link:hover { text-decoration: underline; }
  .fade-up { animation: fadeUp 0.5s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;