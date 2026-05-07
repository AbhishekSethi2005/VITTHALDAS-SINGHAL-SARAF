import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart, Phone, ChevronDown, Sparkles } from 'lucide-react';
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

  // Prevent body scroll when mobile menu is open
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
      {/* Announcement bar */}
      <div className="bg-brand-dark text-white/90 text-[11px] tracking-wide">
        <div className="section-container py-2 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-1 sm:gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone size={11} className="text-brand-gold-light" />
              +91 751 234 5678
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline">Sarafa Bazar, Gwalior</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-brand-gold-light font-medium flex items-center gap-1.5">
              <Sparkles size={10} />
              Hallmark Certified
            </span>
            <span className="text-white/40">|</span>
            <span>Since 1965</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
          : 'bg-white'
      }`}>
        <nav className="section-container">
          <div className="flex items-center justify-between h-[72px] flex-nowrap">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[16px] sm:text-[17px] lg:text-[18px] font-accent font-bold tracking-[-0.02em] text-brand-dark group-hover:text-brand-gold-dark transition-colors duration-300">
                  Vitthaldas Singhal Saraf
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.3em] uppercase text-brand-gold-muted">
                  Est. 1965
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 rounded-md ${
                    isActive(l.path)
                      ? 'text-brand-gold-dark'
                      : 'text-brand-charcoal hover:text-brand-gold-dark hover:bg-brand-cream/50'
                  }`}
                >
                  {l.label}
                  {isActive(l.path) && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-brand-gold rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <Link
                to="/shop"
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-brand-muted hover:text-brand-gold-dark hover:bg-brand-cream/60 transition-all"
                title="Wishlist"
              >
                <Heart size={19} strokeWidth={1.5} />
              </Link>

              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    import('react-hot-toast').then(m => m.default('Please login to view your cart'));
                  } else {
                    navigate('/cart');
                  }
                }}
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-gold-dark hover:bg-brand-cream/60 transition-all"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {user && cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-brand-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none animate-scale-in">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-brand-muted hover:text-brand-gold-dark hover:bg-brand-cream/60 transition-all">
                    <User size={19} strokeWidth={1.5} />
                    <span className="hidden lg:inline text-[13px] font-medium">{user.name?.split(' ')[0]}</span>
                    <ChevronDown size={13} className="hidden lg:block transition-transform group-hover:rotate-180 duration-300" />
                  </button>
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1.5 z-50 translate-y-1 group-hover:translate-y-0">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-brand-dark">{user.name}</p>
                      <p className="text-xs text-brand-muted truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-brand-cream hover:text-brand-dark transition-colors">My Profile</Link>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-brand-cream hover:text-brand-dark transition-colors">Order History</Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-brand-gold font-medium hover:bg-brand-cream transition-colors">Admin Panel</Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex ml-2 text-[13px] font-semibold text-brand-dark border border-brand-dark/20 hover:border-brand-gold hover:text-brand-gold-dark px-5 py-2 rounded-full transition-all duration-200"
                >
                  Sign In
                </Link>
              )}

              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:bg-brand-cream/60 ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile drawer - full overlay */}
        {mobileOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/30 z-30 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
            <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in-down fixed w-full top-[108px] left-0 shadow-2xl z-40 max-h-[70vh] overflow-y-auto">
              <div className="section-container py-6 space-y-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    className={`block text-[15px] font-medium py-3.5 border-b border-gray-50 transition-colors ${
                      isActive(l.path) ? 'text-brand-gold-dark' : 'text-brand-charcoal hover:text-brand-gold-dark'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                {!user && (
                  <div className="pt-4 pb-2">
                    <Link
                      to="/login"
                      className="flex justify-center w-full text-[14px] font-semibold text-white bg-brand-dark hover:bg-brand-gold-dark px-5 py-3.5 rounded-full transition-all duration-200"
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
