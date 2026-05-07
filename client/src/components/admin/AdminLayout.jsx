import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tags, TrendingUp, Image, Settings, LogOut, Eye, Menu, X, ChevronRight, Gem } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Categories', path: '/admin/categories', icon: Tags },
  { label: 'Metal Rates', path: '/admin/rates', icon: TrendingUp },
  { label: 'Banners', path: '/admin/banners', icon: Image },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ title, children }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/admin" className="block">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-dark flex items-center justify-center">
              <Gem size={16} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="text-base font-heading font-bold text-brand-dark leading-tight">VSS Admin</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-medium">Management Panel</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Menu</p>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
              }`}>
              <item.icon size={17} className={`transition-colors ${active ? 'text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold-dark'}`} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} className="text-brand-gold/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-gray-100">
        {user && (
          <div className="px-3 py-2.5 mb-1">
            <p className="text-xs font-medium text-brand-dark truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        <Link to="/" className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-medium text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors mb-1">
          <Eye size={16} /> View Storefront
        </Link>
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#F5F6F8]">
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200/80 hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 w-[280px] h-full bg-white z-50 md:hidden flex flex-col shadow-2xl animate-slide-in-right" style={{ animationDuration: '0.25s' }}>
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200/80 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Menu size={18} />
            </button>
            <div>
              <h2 className="text-base font-semibold text-brand-dark leading-tight">{title}</h2>
              <p className="text-[10px] text-gray-400 hidden sm:block">Vitthaldas Singhal Saraf · Admin Panel</p>
            </div>
          </div>
          <Link to="/" className="hidden sm:flex text-[12px] font-medium text-gray-500 hover:text-brand-dark items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200/80 hover:border-gray-300 transition-all">
            <Eye size={14} /> View Store
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
