import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [];

  return (
    <>
      <Helmet><title>Admin Dashboard | VSS</title></Helmet>
      <AdminLayout title="Dashboard Overview">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse" />)}
          </div>
        ) : !stats ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">Could not load dashboard data.</p>
            <p className="text-sm text-gray-400 mt-1">Make sure the database is connected.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between transition-transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg}`}>
                      <card.icon size={24} className={card.color} />
                    </div>
                    <TrendingUp size={20} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-brand-dark mb-1">{card.value}</p>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-brand-dark">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm text-brand-gold font-medium hover:underline">View All</Link>
              </div>
              {stats.recentOrders?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-brand-dark">{order.orderNumber}</td>
                          <td className="px-6 py-4 text-gray-600">{order.user?.name || 'Guest'}</td>
                          <td className="px-6 py-4 font-medium text-brand-dark">{formatPrice(order.totalAmount)}</td>
                          <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${getStatusColor(order.status)}`}>{order.status}</span></td>
                          <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No recent orders found</p>
                </div>
              )}
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}
