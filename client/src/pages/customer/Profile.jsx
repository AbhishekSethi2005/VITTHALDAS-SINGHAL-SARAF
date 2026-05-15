import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Package, Heart, MapPin, CreditCard, Bell, Lock, LogOut, 
  ChevronRight, Shield, Award, Truck, Users, Edit3, Trash2, Plus, 
  ShoppingBag, CheckCircle, Clock, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import LuxuryPageBanner from '../../components/common/LuxuryPageBanner';
import toast from 'react-hot-toast';

const TRUST_BADGES = [
  { icon: Shield, title: "100% Pure Gold", desc: "Transparent pricing with full weight & rate" },
  { icon: Award, title: "BIS 916 Hallmark", desc: "Certified jewellery with guaranteed purity" },
  { icon: Truck, title: "Lifetime Exchange", desc: "Full value exchange on all gold jewellery" },
  { icon: Users, title: "Customer Support", desc: "Dedicated support for a seamless experience" },
];

const SIDEBAR_LINKS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Change Password', icon: Lock },
];

export default function Profile() {
  const { user, logout, wishlist, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || 'profile');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);
  const [orders, setOrders] = useState([]);
  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Forms State
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '', isDefault: false });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [meRes, ordersRes, notifRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/orders/my-orders'),
        api.get('/notifications').catch(() => ({ data: { data: [] } }))
      ]);
      setFullUser(meRes.data.data);
      setOrders(ordersRes.data.data || []);
      setNotifications(notifRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ---------------- HANDLERS ----------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    setIsUpdatingPass(true);
    try {
      await api.put('/auth/password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success("Password updated successfully!");
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsAddingAddress(true);
    try {
      if (editingAddressId) {
        const { data } = await api.put(`/auth/addresses/${editingAddressId}`, addressForm);
        setFullUser(prev => ({ ...prev, addresses: data.data }));
        toast.success("Address updated successfully!");
      } else {
        const { data } = await api.post('/auth/addresses', addressForm);
        setFullUser(prev => ({ ...prev, addresses: data.data }));
        toast.success("Address added successfully!");
      }
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '', isDefault: false });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address.");
    } finally {
      setIsAddingAddress(false);
    }
  };

  const startEditAddress = (addr) => {
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault
    });
    setEditingAddressId(addr._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const { data } = await api.delete(`/auth/addresses/${id}`);
      setFullUser(prev => ({ ...prev, addresses: data.data }));
      toast.success("Address removed.");
    } catch (err) {
      toast.error("Failed to delete address.");
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      toast.success("Removed from wishlist.");
    } catch (err) {
      toast.error("Failed to remove item.");
    }
  };

  if (!user) return null;

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0).toLocaleString('en-IN'),
    wishlistItems: wishlist?.length || 0,
    membership: 'Premium'
  };

  const savedAddresses = fullUser?.addresses || [];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="bg-[#fcf1d4] text-[#B58B22] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><CheckCircle size={10} /> Confirmed</span>;
      case 'processing': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><Clock size={10} /> Processing</span>;
      case 'shipped': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><Truck size={10} /> Shipped</span>;
      case 'delivered': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><CheckCircle size={10} /> Delivered</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><X size={10} /> Cancelled</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><Clock size={10} /> Pending</span>;
    }
  };

  // ---------------- TAB RENDERS ----------------
  const renderProfileTab = () => (
    <div className="flex flex-col gap-6 fade-in">
      {/* Main Profile Card */}
      <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#1a1208] border-2 border-[#D4AF37] flex items-center justify-center text-white font-serif text-4xl shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#E9D9C2] rounded-full flex items-center justify-center text-[#2A2118] hover:text-[#D4AF37] shadow-sm transition-colors">
              <Edit3 size={14} />
            </button>
          </div>
          <div>
            <h2 className="font-serif text-3xl text-[#2A2118] mb-2">{user.name}</h2>
            <div className="inline-block bg-[#D4AF37] text-white text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full mb-4">
              Premium Member
            </div>
            <div className="space-y-1.5 text-[14px] text-[#6E6256]">
              <p className="flex items-center justify-center md:justify-start gap-2"><User size={14} className="text-[#B58B22]" /> {user.email}</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><MapPin size={14} className="text-[#B58B22]" /> {fullUser?.phone || '+91 - Update Profile'}</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><Clock size={14} className="text-[#B58B22]" /> Member Since {new Date(fullUser?.createdAt || Date.now()).getFullYear()}</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <h4 className="text-[#2A2118] text-[15px] font-medium mb-4 text-center md:text-left">Quick Actions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'View Orders', icon: Package, tab: 'orders' },
              { label: 'My Wishlist', icon: Heart, tab: 'wishlist' },
              { label: 'Manage Address', icon: MapPin, tab: 'addresses' },
              { label: 'Payment Methods', icon: CreditCard, tab: 'payments' }
            ].map(action => (
              <button 
                key={action.label}
                onClick={() => setActiveTab(action.tab)}
                className="bg-[#fdfaf6] border border-[#E9D9C2]/50 rounded-[12px] p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#FFFDF8] hover:border-[#D4AF37] transition-all group shadow-sm hover:shadow-md"
              >
                <action.icon size={20} strokeWidth={1.5} className="text-[#B58B22] group-hover:text-[#D4AF37]" />
                <span className="text-[11px] font-medium text-[#6E6256] group-hover:text-[#2A2118] text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Luxury Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
          { label: 'Total Spent', value: `₹${stats.totalSpent}`, icon: CreditCard },
          { label: 'Wishlist Items', value: stats.wishlistItems, icon: Heart },
          { label: 'Membership', value: stats.membership, icon: Award }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[16px] shadow-[0_5px_15px_rgba(42,8,13,0.04)] border border-[#E9D9C2]/50 p-5 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
            <div>
              <h4 className="font-serif text-2xl text-[#2A2118] mb-1">{stat.value}</h4>
              <p className="text-[12px] text-[#6E6256] font-medium">{stat.label}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#fdfaf6] flex items-center justify-center text-[#B58B22] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
              <stat.icon size={18} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders Overview */}
        <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E9D9C2]/50">
            <h3 className="font-serif text-xl text-[#2A2118]">Recent Orders</h3>
            <button onClick={() => setActiveTab('orders')} className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.1em] hover:text-[#B58B22] flex items-center gap-1">
              View All Orders <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {loading ? (
              <p className="text-[#6E6256] text-sm py-4">Loading orders...</p>
            ) : orders.length > 0 ? (
              orders.slice(0, 2).map((order) => (
                <div key={order._id} className="flex gap-4 p-4 rounded-[12px] bg-[#fdfaf6] border border-[#E9D9C2]/30 hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-[8px] overflow-hidden bg-white border border-[#E9D9C2] flex-shrink-0">
                    {order.items && order.items[0] && (
                      <img src={order.items[0].image || '/images/gold.png'} alt="Product" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-[16px] text-[#2A2118] truncate mb-1">
                      {order.items && order.items[0] ? order.items[0].name : `Order #${order._id.slice(-6)}`}
                    </h4>
                    <p className="text-[12px] text-[#6E6256] mb-2">Order #{order.orderNumber || order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-[15px] font-medium text-[#2A2118]">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    {getStatusBadge(order.status)}
                    <button onClick={() => navigate(`/order-confirmation/${order._id}`)} className="text-[11px] text-[#B58B22] font-medium hover:text-[#2A2118] border border-[#E9D9C2] px-3 py-1.5 rounded-[6px] hover:border-[#2A2118] transition-colors">
                      View Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#6E6256]">
                <Package size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-[14px]">No recent orders found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Addresses Overview */}
        <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E9D9C2]/50">
            <h3 className="font-serif text-xl text-[#2A2118]">Saved Addresses</h3>
            <button onClick={() => setActiveTab('addresses')} className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.1em] hover:text-[#B58B22] flex items-center gap-1">
              Manage Addresses <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {savedAddresses.slice(0, 2).map(addr => (
              <div key={addr._id} className="relative p-5 rounded-[12px] bg-[#fdfaf6] border border-[#E9D9C2]/50 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFFDF8] border border-[#D4AF37]/30 flex items-center justify-center text-[#B58B22] flex-shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-[#2A2118] text-[14px]">{addr.fullName}</h4>
                      {addr.isDefault && (
                        <span className="bg-[#E9D9C2]/40 text-[#8a7060] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Default</span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#6E6256] leading-relaxed mb-2 max-w-[250px]">{addr.addressLine1}, {addr.city}</p>
                    <p className="text-[13px] text-[#2A2118] font-medium">{addr.phone}</p>
                  </div>
                </div>
              </div>
            ))}
            {savedAddresses.length === 0 && (
              <div className="text-center py-8 text-[#6E6256]">
                <MapPin size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-[14px]">No saved addresses.</p>
              </div>
            )}
            <button onClick={() => setActiveTab('addresses')} className="mt-auto flex items-center justify-center gap-2 w-full py-4 border border-dashed border-[#D4AF37] rounded-[12px] text-[#B58B22] hover:bg-[#FFFDF8] hover:text-[#2A2118] transition-colors text-[13px] font-medium">
              <Plus size={16} /> Add New Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-8 fade-in">
      <h3 className="font-serif text-2xl text-[#2A2118] mb-6">All Orders</h3>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="flex flex-col md:flex-row gap-4 p-5 rounded-[12px] bg-[#fdfaf6] border border-[#E9D9C2]/50 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-[8px] overflow-hidden bg-white border border-[#E9D9C2] flex-shrink-0">
                {order.items && order.items[0] && (
                  <img src={order.items[0].image || '/images/gold.png'} alt="Product" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-[18px] text-[#2A2118] mb-1">
                  {order.items && order.items[0] ? order.items[0].name : `Order #${order._id.slice(-6)}`}
                  {order.items?.length > 1 && <span className="text-[#8a7060] text-sm"> + {order.items.length - 1} more</span>}
                </h4>
                <p className="text-[13px] text-[#6E6256] mb-2">Order ID: {order.orderNumber || order._id.toUpperCase()} • Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center gap-3">
                  <p className="text-[16px] font-medium text-[#2A2118]">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button onClick={() => navigate(`/order-confirmation/${order._id}`)} className="text-[12px] text-white bg-[#4a0e17] font-medium hover:bg-[#2a080d] px-6 py-2.5 rounded-[8px] transition-colors uppercase tracking-[0.1em]">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[#6E6256]">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <h4 className="font-serif text-2xl text-[#2A2118] mb-2">No orders yet</h4>
          <p className="text-[14px] mb-6">Looks like you haven't made any purchases yet.</p>
          <button onClick={() => navigate('/shop')} className="bg-[#D4AF37] text-white px-8 py-3 rounded-[8px] text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#B58B22] transition-colors">
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );

  const renderWishlistTab = () => (
    <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-8 fade-in">
      <h3 className="font-serif text-2xl text-[#2A2118] mb-6">My Wishlist</h3>
      {wishlist?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(product => {
            const imageUrl = product.images?.[0]?.url || product.image || '/images/gold.png';
            const productPrice = product.pricing?.totalBeforeTax ?? product.price ?? product.fixedPrice ?? 0;
            return (
              <div key={product._id} className="group rounded-[20px] border border-[#E9D9C2]/50 overflow-hidden hover:shadow-lg transition-shadow bg-[#FFFDF8]">
                <div className="aspect-square bg-[#fdfaf6] relative overflow-hidden border-b border-[#E9D9C2]/30">
                  <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/gold.png'; }} 
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#B58B22] shadow-sm">
                    {product.purity || '22K'}
                  </span>
                  <button 
                    onClick={() => handleRemoveWishlist(product._id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#e05a5a] hover:bg-[#e05a5a] hover:text-white transition-colors shadow-sm"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="p-4 flex flex-col gap-y-1 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#B58B22] leading-none">
                    {product.category?.name || product.metalType || 'JEWELLERY'}
                  </p>
                  <h4 className="font-serif text-[16px] text-[#2A2118] truncate font-medium mb-0.5">{product.name}</h4>
                  <p className="text-[#4a0e17] font-bold text-[15px]">₹{productPrice.toLocaleString('en-IN')}</p>
                  <button onClick={() => navigate(`/product/${product.slug || product._id}`)} className="mt-2 w-full border border-[#D4AF37] text-[#B58B22] hover:bg-[#D4AF37] hover:text-white py-2 rounded-[8px] text-[11px] font-bold uppercase tracking-[0.1em] transition-colors bg-white shadow-sm">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-[#6E6256]">
          <Heart size={48} className="mx-auto mb-4 opacity-30" />
          <h4 className="font-serif text-2xl text-[#2A2118] mb-2">Wishlist is empty</h4>
          <p className="text-[14px] mb-6">Save your favorite pieces here.</p>
          <button onClick={() => navigate('/collections')} className="bg-[#D4AF37] text-white px-8 py-3 rounded-[8px] text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#B58B22] transition-colors">
            Explore Collections
          </button>
        </div>
      )}
    </div>
  );

  const renderAddressesTab = () => (
    <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-8 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl text-[#2A2118]">Manage Addresses</h3>
        {!showAddressForm && (
          <button onClick={() => {
            setAddressForm({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '', isDefault: false });
            setEditingAddressId(null);
            setShowAddressForm(true);
          }} className="flex items-center gap-2 bg-[#4a0e17] text-white px-5 py-2.5 rounded-[8px] text-[11px] font-bold tracking-[0.1em] uppercase hover:bg-[#2a080d] transition-colors">
            <Plus size={14} /> Add New
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {savedAddresses.map(addr => (
          <div key={addr._id} className="relative p-6 rounded-[16px] bg-[#fdfaf6] border border-[#E9D9C2]/50 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#D4AF37]/30 flex items-center justify-center text-[#B58B22]">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-[18px] text-[#2A2118]">{addr.fullName}</h4>
                    {addr.isDefault && <span className="bg-[#D4AF37] text-white text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Default</span>}
                  </div>
                  <p className="text-[13px] text-[#2A2118] font-medium">{addr.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEditAddress(addr)} className="text-[#B58B22] hover:bg-[#fcf1d4] p-2 rounded-full transition-colors" title="Edit Address">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDeleteAddress(addr._id)} className="text-[#e05a5a] hover:bg-red-50 p-2 rounded-full transition-colors" title="Delete Address">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-[14px] text-[#6E6256] leading-relaxed">
              {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}<br />
              {addr.city}, {addr.state} - {addr.pincode}
            </p>
          </div>
        ))}
        {savedAddresses.length === 0 && !showAddressForm && (
          <div className="col-span-full text-center py-16 text-[#6E6256]">
            <MapPin size={48} className="mx-auto mb-4 opacity-30" />
            <h4 className="font-serif text-2xl text-[#2A2118] mb-2">No addresses found</h4>
            <p className="text-[14px]">You haven't added any shipping addresses yet.</p>
          </div>
        )}
      </div>

      {showAddressForm && (
        <div className="bg-[#fdfaf6] border border-[#E9D9C2] rounded-[16px] p-6 mb-8 fade-in">
          <h4 className="font-serif text-[20px] text-[#2A2118] mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
          <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-1">Full Name *</label>
              <input type="text" required value={addressForm.fullName} onChange={e=>setAddressForm({...addressForm, fullName: e.target.value})} className="w-full bg-white border border-[#E9D9C2] rounded-[8px] px-4 py-2.5 text-[14px] outline-none focus:border-[#D4AF37]" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-1">Phone *</label>
              <input type="text" required value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-white border border-[#E9D9C2] rounded-[8px] px-4 py-2.5 text-[14px] outline-none focus:border-[#D4AF37]" placeholder="10-digit number" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-1">Address Line 1 *</label>
              <input type="text" required value={addressForm.addressLine1} onChange={e=>setAddressForm({...addressForm, addressLine1: e.target.value})} className="w-full bg-white border border-[#E9D9C2] rounded-[8px] px-4 py-2.5 text-[14px] outline-none focus:border-[#D4AF37]" placeholder="Flat, House no., Building, Company, Apartment" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-1">City *</label>
              <input type="text" required value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-white border border-[#E9D9C2] rounded-[8px] px-4 py-2.5 text-[14px] outline-none focus:border-[#D4AF37]" placeholder="City" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-1">State *</label>
              <input type="text" required value={addressForm.state} onChange={e=>setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-white border border-[#E9D9C2] rounded-[8px] px-4 py-2.5 text-[14px] outline-none focus:border-[#D4AF37]" placeholder="State" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-1">Pincode *</label>
              <input type="text" required value={addressForm.pincode} onChange={e=>setAddressForm({...addressForm, pincode: e.target.value})} className="w-full bg-white border border-[#E9D9C2] rounded-[8px] px-4 py-2.5 text-[14px] outline-none focus:border-[#D4AF37]" placeholder="6 digits [0-9] PIN code" />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e=>setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 accent-[#D4AF37]" />
              <label htmlFor="isDefault" className="text-[13px] text-[#6E6256] cursor-pointer">Set as default address</label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-[#E9D9C2] pt-4">
              <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} className="px-6 py-2.5 rounded-[8px] text-[12px] font-bold uppercase tracking-[0.1em] text-[#6E6256] hover:bg-white border border-transparent hover:border-[#E9D9C2] transition-colors">Cancel</button>
              <button type="submit" disabled={isAddingAddress} className="bg-[#D4AF37] text-white px-8 py-2.5 rounded-[8px] text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#B58B22] transition-colors">{isAddingAddress ? 'Saving...' : 'Save Address'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-8 fade-in max-w-2xl">
      <h3 className="font-serif text-2xl text-[#2A2118] mb-2">Change Password</h3>
      <p className="text-[#6E6256] text-[14px] mb-8">Ensure your account is using a long, random password to stay secure.</p>
      
      <form onSubmit={handlePasswordChange} className="space-y-5">
        <div>
          <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-2">Current Password</label>
          <div className="relative">
            <input 
              type={showPass ? 'text' : 'password'} 
              required value={passForm.currentPassword} 
              onChange={e=>setPassForm({...passForm, currentPassword: e.target.value})} 
              className="w-full bg-[#fdfaf6] border border-[#E9D9C2] rounded-[8px] px-4 py-3 text-[14px] outline-none focus:border-[#D4AF37]" 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7060] hover:text-[#D4AF37]"><Eye size={16} /></button>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-2">New Password</label>
          <div className="relative">
            <input 
              type={showPass ? 'text' : 'password'} 
              required value={passForm.newPassword} 
              onChange={e=>setPassForm({...passForm, newPassword: e.target.value})} 
              className="w-full bg-[#fdfaf6] border border-[#E9D9C2] rounded-[8px] px-4 py-3 text-[14px] outline-none focus:border-[#D4AF37]" 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7060] hover:text-[#D4AF37]"><Eye size={16} /></button>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[#8a7060] uppercase tracking-wider mb-2">Confirm New Password</label>
          <div className="relative">
            <input 
              type={showPass ? 'text' : 'password'} 
              required value={passForm.confirmPassword} 
              onChange={e=>setPassForm({...passForm, confirmPassword: e.target.value})} 
              className="w-full bg-[#fdfaf6] border border-[#E9D9C2] rounded-[8px] px-4 py-3 text-[14px] outline-none focus:border-[#D4AF37]" 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7060] hover:text-[#D4AF37]"><Eye size={16} /></button>
          </div>
        </div>
        <div className="pt-4 border-t border-[#E9D9C2] flex justify-end">
          <button type="submit" disabled={isUpdatingPass} className="bg-[#4a0e17] text-white px-8 py-3 rounded-[8px] text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-[#2a080d] transition-colors">
            {isUpdatingPass ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );

  const markNotificationAsRead = async (id, link) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      if (link) navigate(link);
    } catch (e) { console.error(e); }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.put(`/notifications/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { console.error(e); }
  };

  const renderNotificationsTab = () => (
    <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-8 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl text-[#2A2118]">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllNotificationsAsRead} className="text-[#D4AF37] text-[12px] font-bold uppercase tracking-[0.1em] hover:text-[#B58B22] transition-colors">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              onClick={() => markNotificationAsRead(notif._id, notif.link)}
              className={`flex items-start gap-4 p-5 rounded-[12px] border cursor-pointer transition-all ${
                notif.isRead 
                  ? 'bg-white border-[#E9D9C2]/30 hover:border-[#D4AF37]/50 opacity-75' 
                  : 'bg-[#FFFDF8] border-[#D4AF37]/50 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notif.isRead ? 'bg-[#fdfaf6] text-[#8a7060]' : 'bg-[#D4AF37] text-white shadow-inner'
              }`}>
                {notif.type === 'order' ? <Package size={18} /> : 
                 notif.type === 'price' ? <Award size={18} /> : 
                 notif.type === 'product' ? <Heart size={18} /> : <Bell size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-[15px] ${notif.isRead ? 'text-[#6E6256]' : 'text-[#2A2118] font-bold'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-[#8a7060] whitespace-nowrap ml-4">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[13px] text-[#6E6256]">{notif.message}</p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[#6E6256]">
          <Bell size={48} className="mx-auto mb-4 opacity-30" />
          <h4 className="font-serif text-2xl text-[#2A2118] mb-2">No notifications</h4>
          <p className="text-[14px]">You're all caught up!</p>
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (title, icon) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-8 fade-in text-center py-20">
        <Icon size={48} className="mx-auto mb-6 text-[#D4AF37] opacity-50" />
        <h3 className="font-serif text-3xl text-[#2A2118] mb-3">{title}</h3>
        <p className="text-[#6E6256] text-[15px] max-w-md mx-auto">This feature is currently being crafted with the utmost care and will be available to our premium members soon.</p>
        <button onClick={() => setActiveTab('profile')} className="mt-8 border border-[#D4AF37] text-[#B58B22] hover:bg-[#D4AF37] hover:text-white px-8 py-3 rounded-[8px] text-[12px] font-bold tracking-[0.1em] uppercase transition-colors">
          Return to Profile
        </button>
      </div>
    );
  };

  return (
    <>
      <Helmet><title>My Profile | Vitthaldas Singhal Saraf</title></Helmet>

      <div className="bg-[#fdfaf6] min-h-screen pb-20 font-sans">
        
        {/* 1. Luxury Hero Banner */}
        <LuxuryPageBanner 
          title="My Profile"
          subtitle="Manage your account details and explore your orders"
          bgImage="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=2000"
          breadcrumbs={[{ label: 'My Profile' }]}
          hideTrustBadges={true}
        />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 -mt-10 relative z-20">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 2. Left Sidebar Navigation */}
            <div className="w-full lg:w-[320px] flex flex-col gap-6">
              <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(42,8,13,0.05)] border border-[#E9D9C2]/50 p-6">
                <nav className="flex flex-col space-y-2">
                  {SIDEBAR_LINKS.map(link => (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className={`flex items-center gap-4 w-full px-4 py-3 rounded-[12px] transition-all duration-300 text-[14px] font-medium ${
                        activeTab === link.id 
                          ? 'bg-[#fdfaf6] text-[#B58B22] border border-[#D4AF37]/30 shadow-sm' 
                          : 'text-[#6E6256] hover:bg-[#fdfaf6] hover:text-[#2A2118]'
                      }`}
                    >
                      <link.icon size={18} strokeWidth={activeTab === link.id ? 2 : 1.5} className={activeTab === link.id ? 'text-[#D4AF37]' : ''} />
                      {link.label}
                    </button>
                  ))}
                  
                  <div className="h-[1px] w-full bg-[#E9D9C2]/50 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-3 rounded-[12px] transition-all duration-300 text-[14px] font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} strokeWidth={1.5} />
                    Logout
                  </button>
                </nav>
              </div>

              {/* Bottom sidebar membership card */}
              <div className="rounded-[20px] shadow-[0_15px_35px_rgba(42,8,13,0.15)] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a080d] via-[#4a0e17] to-[#30080F]"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_#D4AF37_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                
                <div className="relative z-10 p-8 text-center flex flex-col items-center">
                  <Award className="text-[#D4AF37] mb-4" size={32} strokeWidth={1.5} />
                  <h3 className="font-serif text-2xl text-[#D4AF37] mb-2">Exclusive Member</h3>
                  <p className="text-[#E9D9C2] text-[13px] font-light leading-relaxed mb-6">
                    You are a valued member. Enjoy exclusive benefits and early access to collections.
                  </p>
                  <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-white py-3 rounded-[8px] text-[12px] font-bold tracking-[0.15em] uppercase hover:shadow-[0_5px_15px_rgba(212,175,55,0.4)] transition-all duration-300">
                    Explore Benefits &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {loading ? (
                <div className="bg-white rounded-[20px] border border-[#E9D9C2]/50 p-12 text-center text-[#6E6256] shadow-sm">
                  <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Loading your luxury experience...
                </div>
              ) : (
                <>
                  {activeTab === 'profile' && renderProfileTab()}
                  {activeTab === 'orders' && renderOrdersTab()}
                  {activeTab === 'wishlist' && renderWishlistTab()}
                  {activeTab === 'addresses' && renderAddressesTab()}
                  {activeTab === 'security' && renderSecurityTab()}
                  {activeTab === 'payments' && renderPlaceholder('Payment Methods', CreditCard)}
                  {activeTab === 'notifications' && renderNotificationsTab()}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 7. Trust Strip Section */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mt-20">
          <div className="bg-white rounded-[20px] border border-[#E9D9C2] py-8 px-6 md:px-12 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-[#E9D9C2]/50">
              {TRUST_BADGES.map((badge, i) => (
                <div key={i} className={`flex flex-col items-center text-center px-4 ${i === 0 ? 'pl-0' : ''} ${i === TRUST_BADGES.length - 1 ? 'pr-0' : ''}`}>
                  <badge.icon className="text-[#D4AF37] mb-4" size={32} strokeWidth={1} />
                  <h4 className="font-serif text-[18px] text-[#2A2118] mb-2">{badge.title}</h4>
                  <p className="text-[12px] text-[#6E6256] leading-relaxed max-w-[200px]">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
