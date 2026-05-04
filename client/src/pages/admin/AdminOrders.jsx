import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Eye, ChevronDown } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 15 });
    if (filterStatus) params.set('status', filterStatus);
    api.get(`/orders/admin/all?${params}`)
      .then(({ data }) => { setOrders(data.data || []); setPagination(data.pagination || {}); })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(page); }, [page, filterStatus]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order ${newStatus}`);
      fetchOrders(page);
    } catch { toast.error('Failed to update'); }
  };

  const nextStatus = (current) => {
    const flow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  return (
    <>
      <Helmet><title>Orders | Admin | VSS</title></Helmet>
      <AdminLayout title="Manage Orders">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => { setFilterStatus(''); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!filterStatus ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All
          </button>
          {statuses.map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filterStatus === s ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />)}</div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center"><p className="text-gray-500 font-medium">No orders found</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order._id}>
                  {/* Order Row */}
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                    <div className="flex items-center gap-6 flex-1">
                      <div className="min-w-[130px]">
                        <p className="font-medium text-brand-dark text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-700">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-400">{order.user?.phone || order.user?.email || ''}</p>
                      </div>
                      <div className="min-w-[100px]">
                        <p className="font-semibold text-brand-dark text-sm">{formatPrice(order.totalAmount)}</p>
                        <p className="text-xs text-gray-400">{order.items?.length || 0} items</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {nextStatus(order.status) && (
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(order._id, nextStatus(order.status)); }}
                          className="text-xs bg-brand-gold/10 text-brand-gold-dark font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold/20 transition-colors capitalize">
                          Mark {nextStatus(order.status)}
                        </button>
                      )}
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedOrder === order._id && (
                    <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="md:col-span-2">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                <div className="w-12 h-14 rounded bg-gray-100 overflow-hidden shrink-0">
                                  {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-brand-dark line-clamp-1">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.metalType} · {item.weight}g · Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-brand-dark">{formatPrice(item.itemPrice)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Summary</h4>
                          <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatPrice(order.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">GST ({order.taxRate}%)</span><span className="font-medium">{formatPrice(order.taxAmount)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-medium">{order.shippingCharges === 0 ? 'Free' : formatPrice(order.shippingCharges)}</span></div>
                            <div className="flex justify-between pt-2 border-t border-gray-100 font-bold text-brand-dark"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
                          </div>

                          {order.shippingAddress && (
                            <div className="mt-4">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping</h4>
                              <div className="bg-white p-4 rounded-lg border border-gray-100 text-sm text-gray-600">
                                <p className="font-medium text-brand-dark">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                                <p className="mt-1 text-gray-400">{order.shippingAddress.phone}</p>
                              </div>
                            </div>
                          )}

                          {/* Status Actions */}
                          <div className="mt-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</h4>
                            <div className="flex flex-wrap gap-2">
                              {statuses.filter(s => s !== order.status).map(s => (
                                <button key={s} onClick={() => updateStatus(order._id, s)}
                                  className="text-[10px] px-3 py-1.5 border border-gray-200 rounded-lg font-medium capitalize hover:bg-gray-100 transition-colors">{s}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
              <div className="flex gap-1">{[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded text-xs font-medium ${pagination.page === i + 1 ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{i + 1}</button>
              ))}</div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
