import { useState, useEffect } from 'react';
import { Search, DollarSign, CreditCard, RefreshCw, Filter } from 'lucide-react';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getAllPayments, refundPayment } from '../../services/paymentService';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refundConfirm, setRefundConfirm] = useState(null);
  const [stats, setStats] = useState({ totalRevenue: 0, completedPayments: 0, pendingPayments: 0, refundedPayments: 0 });

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const response = await getAllPayments(params);
      setPayments(response.data.payments || response.data);
      setTotalPages(response.data.totalPages || 1);
      if (response.data.stats) setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  const handleRefund = async () => {
    try {
      await refundPayment(refundConfirm._id);
      toast.success('Payment refunded successfully');
      setRefundConfirm(null);
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process refund');
    }
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };

  const canRefund = (payment) => payment.status === 'completed';

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-500 mt-1">Track and manage all payments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="text-green-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><CreditCard className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedPayments || 0}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><RefreshCw className="text-yellow-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments || 0}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg"><RefreshCw className="text-gray-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.refundedPayments || 0}</p>
              <p className="text-sm text-gray-500">Refunded</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by payment ID, client, or event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Search</button>
          </form>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : payments.length === 0 ? (
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
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={payment.client?.image || `https://ui-avatars.com/api/?name=${payment.client?.name}&background=random`}
                          alt={payment.client?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{payment.client?.name}</p>
                          <p className="text-sm text-gray-500">{payment.client?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.event?.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{payment.paymentId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">${payment.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[payment.status] || 'bg-gray-100 text-gray-700'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      {canRefund(payment) && (
                        <button
                          onClick={() => setRefundConfirm(payment)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <RefreshCw size={14} />
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      {refundConfirm && (
        <Modal onClose={() => setRefundConfirm(null)} title="Confirm Refund">
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">Are you sure you want to refund this payment? This action cannot be undone.</p>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Client:</span>
                <span className="font-medium text-gray-900">{refundConfirm.client?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Event:</span>
                <span className="font-medium text-gray-900">{refundConfirm.event?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium text-gray-900">${refundConfirm.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID:</span>
                <span className="font-medium text-gray-900 font-mono">{refundConfirm.paymentId}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRefundConfirm(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleRefund} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Process Refund</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
