
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import Collections from './pages/customer/Collections';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Contact from './pages/customer/Contact';
import About from './pages/customer/About';
import Profile from './pages/customer/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRates from './pages/admin/AdminRates';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBanners from './pages/admin/AdminBanners';
import AdminSettings from './pages/admin/AdminSettings';

function ProtectedAdmin({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminShortcut() {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return null;

  return (
    <Link
      to="/admin"
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '28px',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'linear-gradient(135deg, #4A0E17 0%, #2E050A 100%)',
        color: '#E8C97A',
        padding: '14px 22px',
        borderRadius: '30px',
        textDecoration: 'none',
        border: '1px solid #D4AF37',
        boxShadow: '0 12px 30px rgba(74, 14, 23, 0.35)',
        fontFamily: '"Jost", sans-serif',
        fontWeight: '700',
        fontSize: '10px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#FFFDF8';
        e.currentTarget.style.boxShadow = '0 18px 35px rgba(74, 14, 23, 0.5)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#D4AF37';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(74, 14, 23, 0.35)';
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
      Admin Panel
    </Link>
  );
}

function CustomerLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <AdminShortcut />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Customer routes */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
      <Route path="/collections" element={<CustomerLayout><Collections /></CustomerLayout>} />
      <Route path="/product/:slug" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/checkout" element={<CustomerLayout><ProtectedRoute><Checkout /></ProtectedRoute></CustomerLayout>} />
      <Route path="/order-confirmation/:orderId" element={<CustomerLayout><ProtectedRoute><OrderConfirmation /></ProtectedRoute></CustomerLayout>} />
      <Route path="/profile" element={<CustomerLayout><ProtectedRoute><Profile /></ProtectedRoute></CustomerLayout>} />
      <Route path="/orders" element={<CustomerLayout><ProtectedRoute><Profile /></ProtectedRoute></CustomerLayout>} />
      <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
      <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
      <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
      <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
      <Route path="/admin/rates" element={<ProtectedAdmin><AdminRates /></ProtectedAdmin>} />
      <Route path="/admin/products" element={<ProtectedAdmin><AdminProducts /></ProtectedAdmin>} />
      <Route path="/admin/products/new" element={<ProtectedAdmin><AdminProductForm /></ProtectedAdmin>} />
      <Route path="/admin/products/edit/:id" element={<ProtectedAdmin><AdminProductForm /></ProtectedAdmin>} />
      <Route path="/admin/orders" element={<ProtectedAdmin><AdminOrders /></ProtectedAdmin>} />
      <Route path="/admin/categories" element={<ProtectedAdmin><AdminCategories /></ProtectedAdmin>} />
      <Route path="/admin/banners" element={<ProtectedAdmin><AdminBanners /></ProtectedAdmin>} />
      <Route path="/admin/settings" element={<ProtectedAdmin><AdminSettings /></ProtectedAdmin>} />

      {/* Fallback */}
      <Route path="*" element={<CustomerLayout>
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-6xl font-heading font-bold text-brand-dark mb-4">404</h1>
          <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
          <a href="/" className="text-brand-gold font-semibold text-sm uppercase tracking-widest hover:text-brand-gold-dark">Return Home</a>
        </div>
      </CustomerLayout>} />
    </Routes>
  );
}

