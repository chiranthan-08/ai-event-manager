import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Users, UserCheck, CreditCard, TrendingUp, 
  ArrowUpRight, Clock, XCircle, Plus, BarChart3, PieChart 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import DashboardStats from '../../components/DashboardStats';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAdminDashboard } from '../../services/dashboardService';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Total Events', value: data?.totalEvents || 0, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Clients', value: data?.totalClients || 0, icon: Users, color: 'bg-green-500' },
    { label: 'Total Employees', value: data?.totalEmployees || 0, icon: UserCheck, color: 'bg-purple-500' },
    { label: 'Total Registrations', value: data?.totalRegistrations || 0, icon: BarChart3, color: 'bg-orange-500' },
    { label: 'Total Revenue', value: `$${(data?.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, color: 'bg-emerald-500' },
  ];

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: data?.monthlyRevenue || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const registrationChartData = {
    labels: data?.registrationsByCategory?.map(c => c._id) || [],
    datasets: [
      {
        data: data?.registrationsByCategory?.map(c => c.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Create Event
          </Link>
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <TrendingUp size={16} />
            Reports
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <DashboardStats key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64">
            <Bar data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Registrations by Category</h2>
          <div className="h-64 flex items-center justify-center">
            {registrationChartData.labels.length > 0 ? (
              <Doughnut data={registrationChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } } } }} />
            ) : (
              <p className="text-gray-400">No data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/admin/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.upcomingEvents?.length > 0 ? (
              data.upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img src={event.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop'} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{event.category}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <Link to="/admin/payments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentPayments?.length > 0 ? (
                  data.recentPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{payment.client?.name}</td>
                      <td className="py-3 text-sm text-gray-600">{payment.event?.title}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">${payment.amount}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="py-4 text-center text-gray-400">No recent payments</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Cancellation Requests</h2>
        </div>
        <div className="space-y-3">
          {data?.cancellationRequests?.length > 0 ? (
            data.cancellationRequests.map((request) => (
              <div key={request._id} className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <XCircle className="text-red-500 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{request.client?.name} requested cancellation for {request.event?.title}</p>
                  <p className="text-sm text-gray-500">Reason: {request.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Approve</button>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Deny</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">No cancellation requests</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/events" className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors">
          <Calendar className="text-blue-600" size={20} />
          <span className="font-medium text-blue-900">Manage Events</span>
        </Link>
        <Link to="/admin/employees" className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors">
          <UserCheck className="text-purple-600" size={20} />
          <span className="font-medium text-purple-900">Manage Employees</span>
        </Link>
        <Link to="/admin/clients" className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors">
          <Users className="text-green-600" size={20} />
          <span className="font-medium text-green-900">View Clients</span>
        </Link>
        <Link to="/admin/decorations" className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 transition-colors">
          <PieChart className="text-orange-600" size={20} />
          <span className="font-medium text-orange-900">Decorations</span>
        </Link>
      </div>
    </div>
  );
}
