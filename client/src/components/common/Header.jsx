import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Phone, MapPin, Clock, Heart, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, wishlist, unreadCount } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-full relative z-50">
      {/* Top Info Bar */}
      <div className="bg-[#0A0A0A] text-[#9A7B4F] text-[10px] tracking-[0.1em] border-b border-[#2A2A2A]">
        <div className="section-container py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Phone size={12} className="text-[#D4AF37]" /> +91 751 234 5678
            </span>
            <span className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
              <MapPin size={12} className="text-[#D4AF37]" /> Sarafa Bazar, Gwalior
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="flex items-center gap-2 text-[#D4AF37]">
              <span className="w-3 h-3 border border-[#D4AF37] rounded-sm flex items-center justify-center text-[8px] font-bold">H</span>
              Hallmark Certified
            </span>
          </div>
          <div className="flex items-center">
            <span className="flex items-center gap-2">
              <Clock size={12} className="text-[#D4AF37]" /> Since 1965
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`w-full transition-all duration-300 ${scrolled ? 'bg-[#0A0A0A] shadow-md fixed top-0' : 'bg-[#0A0A0A] relative'}`}>
        <div className="section-container">
          <div className="flex items-center justify-between h-[80px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 border border-[#D4AF37] rounded-full flex items-center justify-center p-1">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-[#D4AF37]">
                  <path d="M50 0L60 30L90 10L70 40L100 50L70 60L90 90L60 70L50 100L40 70L10 90L30 60L0 50L30 40L10 10L40 30Z" opacity="0.8"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-heading text-[18px] tracking-[0.1em] font-medium leading-tight group-hover:text-[#D4AF37] transition-colors">
                  VITTHALDAS<br/>SINGHAL SARAF
                </span>
                <span className="text-[#9A7B4F] text-[8px] tracking-[0.3em] mt-0.5">
                  - SINCE 1965 -
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { name: 'HOME', path: '/' },
                { name: 'SHOP', path: '/shop' },
                { name: 'COLLECTIONS', path: '/collections' },
                { name: 'ABOUT US', path: '/about' },
                { name: 'CONTACT US', path: '/contact' }
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] tracking-[0.15em] font-medium transition-colors relative pb-1 ${
                    isActive(link.path) ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <button className="text-white hover:text-[#D4AF37] transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>
              <button onClick={() => navigate(user ? '/profile' : '/login')} className="text-white hover:text-[#D4AF37] transition-colors">
                <User size={18} strokeWidth={1.5} />
              </button>
              {user && (
                <>
                  <button onClick={() => navigate('/profile?tab=wishlist')} className="text-white hover:text-[#D4AF37] transition-colors relative">
                    <Heart size={18} strokeWidth={1.5} />
                    {wishlist?.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                  <button onClick={() => navigate('/profile?tab=notifications')} className="text-white hover:text-[#D4AF37] transition-colors relative">
                    <Bell size={18} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </>
              )}
              <button onClick={() => navigate('/cart')} className="text-white hover:text-[#D4AF37] transition-colors relative">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
