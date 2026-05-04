import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tags, TrendingUp, Image, Settings, LogOut, Eye } from 'lucide-react';
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
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Link to="/admin">
            <h1 className="text-xl font-heading font-bold text-brand-dark">VSS Admin</h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-gold mt-1 font-medium">Management Panel</p>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'}`}>
                <item.icon size={18} className={isActive ? 'text-brand-gold' : 'text-gray-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-brand-dark">{title}</h2>
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-brand-dark flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-md transition-colors">
            <Eye size={16} /> View Storefront
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
