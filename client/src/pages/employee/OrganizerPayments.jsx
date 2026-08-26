import { useState, useEffect, useMemo } from 'react';
import { Search, DollarSign, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getOrganizerPayments } from '../../services/organizerService';
import toast from 'react-hot-toast';

export default function OrganizerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({ totalRevenue: 0, successful: 0, pending: 0, refunded: 0 });

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await getOrganizerPayments(params);
      const data = response.data.payments || [];
      setPayments(data);
      setStats({
        totalRevenue: response.data.totalRevenue || 0,
        successful: data.filter((p) => p.paymentStatus === 'successful').length,
        pending: data.filter((p) => p.paymentStatus === 'pending').length,
        refunded: data.filter((p) => p.paymentStatus === 'refunded').length,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = useMemo(() => {
    if (!localSearch) return payments;
    const q = localSearch.toLowerCase();
    return payments.filter(
      (p) =>
        (p.paymentId || p._id)?.toLowerCase().includes(q) ||
        p.client?.name?.toLowerCase().includes(q) ||
        p.client?.email?.toLowerCase().includes(q) ||
        p.event?.title?.toLowerCase().includes(q) ||
        p.paymentStatus?.toLowerCase().includes(q)
    );
  }, [payments, localSearch]);

  const statusColors = {
    successful: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">Track payments for your events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="text-green-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{'\u20B9'}{(stats.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><CreditCard className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.successful || 0}</p>
              <p className="text-sm text-gray-500">Successful</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><RefreshCw className="text-yellow-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg"><RefreshCw className="text-gray-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.refunded || 0}</p>
              <p className="text-sm text-gray-500">Refunded</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search payments..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
          >
            <option value="">All Status</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 mb-3">{error}</p>
          <button onClick={fetchPayments} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : filteredPayments.length === 0 ? (
        <EmptyState message="No payments found" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Payment ID</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                          {payment.client?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.client?.name}</p>
                          <p className="text-sm text-gray-500">{payment.client?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.event?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{payment.paymentId || payment._id?.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{'\u20B9'}{(payment.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[payment.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
