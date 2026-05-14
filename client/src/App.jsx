
import { Routes, Route, Navigate } from 'react-router-dom';
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

function CustomerLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
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

