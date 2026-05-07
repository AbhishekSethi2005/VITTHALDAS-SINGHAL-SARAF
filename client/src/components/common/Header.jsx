import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart, Phone, ChevronDown, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Collections', path: '/shop' },
    { label: 'Gold', path: '/shop?metalType=gold' },
    { label: 'Silver', path: '/shop?metalType=silver' },
    { label: 'Bridal', path: '/shop?occasion=wedding' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/shop' && location.pathname === '/shop' && !location.search) return true;
    return location.pathname + location.search === path;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cinzel:wght@400;500;600&display=swap');

        .header-announcement {
          background: linear-gradient(90deg, #0f0f0f 0%, #1a1410 40%, #0f0f0f 100%);
          border-bottom: 1px solid rgba(184,134,11,0.25);
          position: relative;
          overflow: hidden;
        }
        .header-announcement::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 120px,
            rgba(184,134,11,0.03) 120px,
            rgba(184,134,11,0.03) 121px
          );
          pointer-events: none;
        }
        .ann-divider {
          width: 1px;
          height: 14px;
          background: linear-gradient(to bottom, transparent, rgba(184,134,11,0.4), transparent);
        }
        .ann-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d4a94a;
        }
        .ann-text {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          font-weight: 400;
        }
        .ann-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(184,134,11,0.5);
        }

        /* Logo */
        .logo-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: 22px;
          letter-spacing: 0.01em;
          color: #1a1a1a;
          line-height: 1;
          transition: color 0.3s;
        }
        .logo-wordmark:hover { color: #8B6914; }
        .logo-est {
          font-family: 'Cinzel', serif;
          font-size: 8.5px;
          letter-spacing: 0.35em;
          color: #b8860b;
          text-transform: uppercase;
          font-weight: 400;
          margin-top: 3px;
          display: block;
        }
        .logo-ornament {
          width: 28px;
          height: 28px;
          border: 1px solid rgba(184,134,11,0.35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(184,134,11,0.08), rgba(184,134,11,0.02));
        }
        .logo-ornament svg {
          width: 14px;
          height: 14px;
          color: #b8860b;
        }

        /* Nav links */
        .nav-link {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #444;
          padding: 8px 14px;
          border-radius: 4px;
          transition: color 0.25s, background 0.25s;
          position: relative;
          text-decoration: none;
        }
        .nav-link:hover {
          color: #8B6914;
          background: rgba(184,134,11,0.05);
        }
        .nav-link.active {
          color: #8B6914;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 1.5px;
          background: #b8860b;
          border-radius: 2px;
        }

        /* Action icons */
        .icon-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #666;
          transition: color 0.2s, background 0.2s;
          cursor: pointer;
          background: transparent;
          border: none;
        }
        .icon-btn:hover {
          color: #8B6914;
          background: rgba(184,134,11,0.07);
        }

        /* Sign In button */
        .signin-btn {
          font-family: 'Cinzel', serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #1a1a1a;
          border: 1px solid rgba(26,26,26,0.25);
          padding: 9px 20px;
          border-radius: 3px;
          text-decoration: none;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .signin-btn:hover {
          border-color: #b8860b;
          color: #8B6914;
          background: rgba(184,134,11,0.04);
        }

        /* Scrolled state */
        .main-header {
          transition: all 0.3s ease;
          background: #fff;
        }
        .main-header.scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(184,134,11,0.12), 0 4px 24px rgba(0,0,0,0.05);
        }

        /* Cart badge */
        .cart-badge {
          position: absolute;
          top: 1px;
          right: 1px;
          width: 17px;
          height: 17px;
          background: #b8860b;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* User dropdown */
        .user-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 210px;
          background: #fff;
          border: 1px solid rgba(184,134,11,0.12);
          border-radius: 6px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
          transform: translateY(4px);
          z-index: 50;
        }
        .user-wrap:hover .user-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          font-size: 12.5px;
          color: #555;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.02em;
        }
        .dropdown-item:hover {
          background: #faf7f2;
          color: #1a1a1a;
        }

        /* Mobile menu */
        .mobile-nav-link {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #333;
          display: block;
          padding: 16px 0;
          border-bottom: 1px solid #f0ece4;
          text-decoration: none;
          transition: color 0.2s;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: #8B6914; }

        /* Thin gold rule under header */
        .gold-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184,134,11,0.3) 20%, rgba(184,134,11,0.5) 50%, rgba(184,134,11,0.3) 80%, transparent);
        }
      `}</style>

      {/* ── Announcement Bar ─────────────────────────────────────────── */}
      <div className="header-announcement">
        <div className="section-container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 0',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="ann-badge">
                <Phone size={10} style={{ color: '#d4a94a' }} />
                +91 751 234 5678
              </span>
              <span className="ann-divider" />
              <span className="ann-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={9} style={{ color: 'rgba(184,134,11,0.6)' }} />
                Sarafa Bazar, Gwalior
              </span>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="ann-badge">
                <Sparkles size={9} />
                BIS Hallmark Certified
              </span>
              <span className="ann-dot" />
              <span className="ann-text">Est. 1965</span>
              <span className="ann-dot" />
              <span className="ann-text">Free Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Header ──────────────────────────────────────────────── */}
      <header className={`main-header sticky top-0 z-50 ${scrolled ? 'scrolled' : ''}`}>
        <nav className="section-container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
          }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Ornament icon */}
                <div className="logo-ornament">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z"
                      stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                {/* Wordmark */}
                <div>
                  <span className="logo-wordmark">Vitthaldas Singhal Saraf</span>
                  <span className="logo-est">Est. 1965 · Gwalior</span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '2px' }}>
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`nav-link${isActive(l.path) ? ' active' : ''}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Wishlist */}
              <Link to="/shop" className="icon-btn hidden sm:flex" title="Wishlist">
                <Heart size={18} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <button
                className="icon-btn"
                style={{ position: 'relative' }}
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    import('react-hot-toast').then(m => m.default('Please login to view your cart'));
                  } else {
                    navigate('/cart');
                  }
                }}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {user && cartCount > 0 && (
                  <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
                )}
              </button>

              {/* User / Sign In */}
              {user ? (
                <div className="user-wrap" style={{ position: 'relative' }}>
                  <button className="icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '0 10px', borderRadius: '20px' }}>
                    <User size={18} strokeWidth={1.5} />
                    <span className="hidden lg:inline" style={{ fontSize: '12px', fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', color: '#444' }}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} style={{ color: '#999' }} />
                  </button>
                  <div className="user-dropdown">
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0ece4' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{user.name}</p>
                      <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                    </div>
                    <Link to="/profile" className="dropdown-item">My Profile</Link>
                    <Link to="/orders" className="dropdown-item">Order History</Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" style={{ color: '#b8860b', fontWeight: 500 }}>Admin Panel</Link>
                    )}
                    <div style={{ borderTop: '1px solid #f0ece4' }}>
                      <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="dropdown-item"
                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#e05252' }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="signin-btn hidden sm:inline-flex" style={{ marginLeft: '8px' }}>
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="icon-btn lg:hidden"
                style={{ marginLeft: '4px' }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Gold rule */}
        <div className="gold-rule" />

        {/* Mobile Drawer */}
        {mobileOpen && (
          <>
            <div
              className="lg:hidden"
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
                zIndex: 30, backdropFilter: 'blur(4px)',
              }}
              onClick={() => setMobileOpen(false)}
            />
            <div
              className="lg:hidden"
              style={{
                position: 'fixed', top: '122px', left: 0, width: '100%',
                background: '#fff', zIndex: 40,
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                borderBottom: '1px solid rgba(184,134,11,0.15)',
                maxHeight: '65vh', overflowY: 'auto',
              }}
            >
              <div className="section-container" style={{ padding: '8px 24px 24px' }}>
                {navLinks.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    className={`mobile-nav-link${isActive(l.path) ? ' active' : ''}`}
                  >
                    {l.label}
                  </Link>
                ))}
                {!user && (
                  <div style={{ paddingTop: '20px' }}>
                    <Link
                      to="/login"
                      style={{
                        display: 'block', textAlign: 'center', width: '100%',
                        fontFamily: "'Cinzel', serif", fontSize: '11px', fontWeight: 500,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: '#fff', background: '#1a1a1a',
                        padding: '14px', borderRadius: '3px', textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
