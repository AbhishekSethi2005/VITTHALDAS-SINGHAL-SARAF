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
      <>
        <Helmet><title>Cart | Vitthaldas Singhal Saraf</title></Helmet>
        <style>{cartStyles}</style>
        <div className="cart-page" style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',textAlign:'center'}}>
          <div>
            <div className="ch" style={{fontSize:'64px',marginBottom:'24px',opacity:0.15}}>💎</div>
            <h2 className="ch" style={{fontSize:'32px',color:'#1a1208',fontWeight:'400',marginBottom:'8px'}}>Sign In to View Cart</h2>
            <p style={{color:'#8a7060',marginBottom:'32px',fontSize:'14px',fontWeight:'300'}}>Your cart is saved to your account so you can access it anywhere.</p>
            <Link to="/login" className="gold-btn" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'14px 32px',textDecoration:'none',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase'}}>
              Sign In <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (loading && items.length === 0) {
    return (
      <>
        <Helmet><title>Cart | Vitthaldas Singhal Saraf</title></Helmet>
        <style>{cartStyles}</style>
        <div className="cart-page" style={{maxWidth:'1100px',margin:'0 auto',padding:'60px 24px'}}>
          <div style={{height:'36px',width:'200px',background:'#ede0d0',borderRadius:'2px',marginBottom:'40px',animation:'shimmer 1.5s infinite'}} />
          {[1,2,3].map(i => <div key={i} style={{height:'100px',background:'#f5ede0',borderRadius:'2px',marginBottom:'16px',animation:'shimmer 1.5s infinite'}} />)}
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Cart | Vitthaldas Singhal Saraf</title></Helmet>
        <style>{cartStyles}</style>
        <div className="cart-page" style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',textAlign:'center'}}>
          <div>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#f5ede0',border:'1px solid #ede0d0',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px'}}>
              <ShoppingBag size={32} style={{color:'rgba(197,160,89,0.4)'}} />
            </div>
            <h2 className="ch" style={{fontSize:'32px',color:'#1a1208',fontWeight:'400',marginBottom:'8px'}}>Your Bag is Empty</h2>
            <p style={{color:'#8a7060',marginBottom:'32px',fontSize:'14px',fontWeight:'300',maxWidth:'360px',margin:'0 auto 32px',lineHeight:'1.7'}}>
              Explore our exquisite collection and find something to treasure.
            </p>
            <Link to="/shop" className="dark-btn" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'14px 36px',textDecoration:'none',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase'}}>
              Browse Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
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
      handleRemove(item._id, item.product.name);
    } else {
      handleQuantityChange(item._id, item.quantity - 1);
    }
  };

  return (
    <>
      <Helmet><title>{`Cart (${cartCount}) | Vitthaldas Singhal Saraf`}</title></Helmet>
      <style>{cartStyles}</style>

      <div className="cart-page">
        {/* Page Header */}
        <div className="cart-hero">
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontSize:'10px',letterSpacing:'0.4em',color:'#C5A059',textTransform:'uppercase',marginBottom:'10px'}}>Your</div>
            <h1 className="ch" style={{fontSize:'clamp(32px,4vw,48px)',color:'#f5ede0',fontWeight:'300'}}>Shopping Bag</h1>
            <p style={{color:'#6a5848',fontSize:'13px',marginTop:'8px',fontWeight:'300'}}>
              {cartCount} {cartCount === 1 ? 'piece' : 'pieces'} selected
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'48px 24px 80px'}}>
          <div className="cart-layout">
            {/* Items */}
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {items.map((item) => {
                const isRemoving = removing === item._id;
                const isUpdating = updating === item._id;
                const rowTotal = item.price * item.quantity;

                return (
                  <div
                    key={item._id}
                    className="cart-item"
                    style={{opacity: isRemoving ? 0.4 : 1, transform: isRemoving ? 'scale(0.98)' : 'scale(1)'}}
                  >
                    {/* Image */}
                    <Link to={`/product/${item.product.slug || item.product._id}`} style={{width:'88px',height:'88px',background:'#f5ede0',flexShrink:0,overflow:'hidden',display:'block',border:'1px solid #ede0d0'}}>
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.4s'}} onMouseOver={e=>e.currentTarget.style.transform='scale(1.08)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'} />
                      ) : (
                        <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',opacity:0.2}}>💎</div>
                      )}
                    </Link>

                    {/* Info */}
                    <div style={{flex:1,minWidth:0}}>
                      <Link to={`/product/${item.product.slug || item.product._id}`} style={{fontWeight:'500',fontSize:'14px',color:'#1a1208',textDecoration:'none',display:'block',marginBottom:'4px',transition:'color 0.2s'}} onMouseOver={e=>e.currentTarget.style.color='#C5A059'} onMouseOut={e=>e.currentTarget.style.color='#1a1208'}>
                        {item.product.name}
                      </Link>
                      <p style={{fontSize:'12px',color:'#8a7060',textTransform:'capitalize',marginBottom:'8px',fontWeight:'300'}}>
                        {item.product.metalType} · {item.product.purity}
                        {item.product.netWeight ? ` · ${item.product.netWeight}g` : ''}
                      </p>
                      <p style={{fontSize:'15px',fontWeight:'600',color:'#1a1208'}}>{formatPrice(item.price)}</p>
                      {!item.product.inStock && (
                        <p style={{fontSize:'11px',color:'#e05a5a',marginTop:'4px',fontWeight:'500'}}>Currently out of stock</p>
                      )}
                    </div>

                    {/* Controls */}
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'space-between',flexShrink:0}}>
                      <button onClick={() => handleRemove(item._id, item.product.name)} disabled={isRemoving}
                        style={{background:'none',border:'none',cursor:'pointer',color:'#d4c0b0',padding:'4px',transition:'color 0.2s'}}
                        onMouseOver={e=>e.currentTarget.style.color='#e05a5a'} onMouseOut={e=>e.currentTarget.style.color='#d4c0b0'}>
                        <Trash2 size={14} />
                      </button>

                      <div className="qty-control">
                        <button onClick={() => handleMinusClick(item)} disabled={isUpdating} className="qty-btn">
                          <Minus size={11} />
                        </button>
                        <span style={{fontSize:'13px',fontWeight:'600',width:'28px',textAlign:'center',opacity:isUpdating?0.4:1}}>
                          {item.quantity}
                        </span>
                        <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} disabled={isUpdating} className="qty-btn">
                          <Plus size={11} />
                        </button>
                      </div>

                      <p style={{fontSize:'12px',color:'#8a7060',fontWeight:'400'}}>{formatPrice(rowTotal)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="summary-panel">
              <h3 className="ch" style={{fontSize:'22px',color:'#1a1208',fontWeight:'400',marginBottom:'24px'}}>
                Order Summary
              </h3>

              <div style={{display:'flex',flexDirection:'column',gap:'12px',fontSize:'14px',borderBottom:'1px solid #ede0d0',paddingBottom:'20px',marginBottom:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>Subtotal ({cartCount} items)</span>
                  <span style={{color:'#1a1208',fontWeight:'500'}}>{formatPrice(cartTotal)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>GST ({taxRate}%)</span>
                  <span style={{color:'#1a1208',fontWeight:'500'}}>{formatPrice(taxAmount)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',color:'#6a5848'}}>
                  <span>Shipping</span>
                  <span style={{fontWeight:'500',color: shippingCharges === 0 ? '#3a9a5c' : '#1a1208'}}>
                    {shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)}
                  </span>
                </div>
                {shippingCharges > 0 && (
                  <p style={{fontSize:'11px',color:'#b8a898',fontStyle:'italic',fontWeight:'300'}}>
                    Free shipping on orders above {formatPrice(freeShippingThreshold)}
                  </p>
                )}
              </div>

              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'28px'}}>
                <span style={{fontSize:'16px',fontWeight:'600',color:'#1a1208'}}>Grand Total</span>
                <span style={{fontSize:'18px',fontWeight:'700',color:'#1a1208'}}>{formatPrice(grandTotal)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="gold-btn"
                style={{width:'100%',padding:'16px',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',border:'none',cursor:'pointer'}}
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>

              <Link to="/shop" style={{display:'block',textAlign:'center',fontSize:'12px',color:'#C5A059',textDecoration:'none',marginTop:'16px',letterSpacing:'0.05em'}}
                onMouseOver={e=>e.currentTarget.style.textDecoration='underline'} onMouseOut={e=>e.currentTarget.style.textDecoration='none'}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const cartStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
  .cart-page { font-family: 'Jost', sans-serif; background: #fdf8f2; }
  .ch { font-family: 'Cormorant Garamond', serif; }
  .cart-hero {
    background: linear-gradient(160deg, #1a0e04 0%, #2d1a08 60%, #3a2010 100%);
    padding: 64px 24px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .cart-hero::before {
    content: ''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
    width: 300px; height: 300px; border: 1px solid rgba(197,160,89,0.08); border-radius: 50%;
  }
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 40px;
    align-items: start;
  }
  @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
  .cart-item {
    display: flex; gap: 20px; align-items: flex-start;
    background: white; border: 1px solid #ede0d0;
    padding: 20px; transition: all 0.3s;
  }
  .cart-item:hover { border-color: rgba(197,160,89,0.4); box-shadow: 0 4px 20px rgba(197,160,89,0.08); }
  .summary-panel {
    background: white; border: 1px solid #ede0d0;
    padding: 32px; position: sticky; top: 100px;
  }
  .summary-panel::before {
    content: ''; display: block; height: 3px;
    background: linear-gradient(90deg, #C5A059, #e8c97a, #C5A059);
    margin: -32px -32px 28px;
  }
  .qty-control {
    display: flex; align-items: center;
    border: 1px solid #ede0d0;
  }
  .qty-btn {
    width: 28px; height: 28px; background: none; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #8a7060; transition: background 0.2s;
  }
  .qty-btn:hover { background: #f5ede0; }
  .qty-btn:disabled { opacity: 0.4; cursor: default; }
  .gold-btn {
    background: linear-gradient(135deg, #C5A059 0%, #e8c97a 50%, #C5A059 100%);
    background-size: 200% auto;
    color: white; font-family: 'Jost', sans-serif;
    transition: background-position 0.4s, transform 0.2s, box-shadow 0.3s;
    box-shadow: 0 4px 20px rgba(197,160,89,0.3);
    font-weight: 500;
  }
  .gold-btn:hover { background-position: right center; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(197,160,89,0.45); }
  .dark-btn {
    background: #1a1208; color: white; font-family: 'Jost', sans-serif;
    font-weight: 500; transition: background 0.3s;
  }
  .dark-btn:hover { background: #C5A059; }
  @keyframes shimmer { 0%,100%{opacity:0.7} 50%{opacity:0.4} }
`;