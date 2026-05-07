import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
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
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ] : [];

  return (
    <>
      <Helmet><title>Admin Dashboard | VSS</title></Helmet>
      <AdminLayout title="Dashboard Overview">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-white rounded-xl border border-gray-100 animate-pulse">
                <div className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100" />
                  <div className="h-7 w-24 bg-gray-100 rounded" />
                  <div className="h-4 w-16 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !stats ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
            <Package size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">Could not load dashboard data.</p>
            <p className="text-sm text-gray-400 mt-1">Make sure the database is connected.</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bg} transition-transform duration-300 group-hover:scale-110`}>
                      <card.icon size={20} className={card.color} />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                      <TrendingUp size={12} className="text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-dark mb-0.5 tracking-tight">{card.value}</p>
                    <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-brand-dark">Recent Orders</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Latest customer transactions</p>
                </div>
                <Link to="/admin/orders" className="flex items-center gap-1.5 text-[12px] text-brand-gold font-semibold hover:text-brand-gold-dark transition-colors group">
                  View All <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
              {stats.recentOrders?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-brand-cream/30 transition-colors group cursor-pointer">
                          <td className="px-6 py-4">
                            <span className="font-medium text-brand-dark text-[13px]">{order.orderNumber}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-[13px]">{order.user?.name || 'Guest'}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-brand-dark text-[13px]">{formatPrice(order.totalAmount)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getStatusColor(order.status)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                order.status === 'delivered' ? 'bg-green-500' :
                                order.status === 'pending' ? 'bg-yellow-500' :
                                order.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                              }`} />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400 text-[12px] flex items-center gap-1.5">
                              <Clock size={11} />
                              {formatDate(order.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">No recent orders found</p>
                  <p className="text-[12px] text-gray-400 mt-1">Orders will appear here once customers start ordering</p>
                </div>
              )}
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}
