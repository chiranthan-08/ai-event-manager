import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, DollarSign, ArrowUpRight, Sparkles, Search } from 'lucide-react';
import DashboardStats from '../../components/DashboardStats';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getClientDashboard } from '../../services/dashboardService';
import toast from 'react-hot-toast';

export default function ClientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getClientDashboard();
      setData(response.data.dashboard || response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'My Bookings', value: data?.totalRegistrations || 0, icon: Ticket, color: 'bg-blue-500' },
    { label: 'Upcoming Events', value: data?.upcomingRegistrations?.length || 0, icon: Calendar, color: 'bg-green-500' },
    { label: 'Total Spent', value: data?.totalSpent || 0, icon: DollarSign, color: 'bg-purple-500', prefix: '₹' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Manage your bookings and events.</p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Search size={16} />
          Browse Events
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <DashboardStats key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/client/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.upcomingRegistrations?.length > 0 ? (
              data.upcomingRegistrations.map((reg) => (
                <div key={reg._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img src={reg.event?.images?.[0] || reg.event?.image} alt={reg.event?.title} className="w-14 h-14 rounded-lg object-cover" onError={(e) => { e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#f97316" rx="8"/><text x="28" y="36" font-size="20" text-anchor="middle" fill="white">🎉</text></svg>`)}`; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{reg.event?.title}</p>
                    <p className="text-sm text-gray-500">{new Date(reg.event?.date).toLocaleDateString()} · {reg.event?.location || reg.event?.venue}</p>
                    <p className="text-xs text-gray-400">{reg.numberOfTickets} ticket{reg.numberOfTickets > 1 ? 's' : ''} · {reg.ticketId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{reg.totalAmount?.toLocaleString()}</p>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">{reg.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-300 mb-2" size={40} />
                <p className="text-gray-400">No upcoming events</p>
                <Link to="/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">Browse Events</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/client/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.upcomingRegistrations?.length > 0 ? (
              data.upcomingRegistrations.slice(0, 5).map((booking) => (
                <div key={booking._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm truncate">{booking.event?.title}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'active' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ticket: {booking.ticketId}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">{booking.numberOfTickets} ticket{booking.numberOfTickets > 1 ? 's' : ''}</p>
                    <p className="text-sm font-semibold text-gray-900">₹{booking.totalAmount?.toLocaleString()}</p>
                  </div>
                  {booking.addOns?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-400 mb-1">Add-ons:</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.addOns.map((a, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {a.name} × {a.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No bookings yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/events"
          className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <Search className="text-blue-600" size={20} />
          <span className="font-medium text-blue-900">Browse Events</span>
        </Link>
        <Link
          to="/client/tickets"
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors"
        >
          <Ticket className="text-green-600" size={20} />
          <span className="font-medium text-green-900">My Tickets</span>
        </Link>
        <Link
          to="/client/ai-assistant"
          className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <Sparkles className="text-purple-600" size={20} />
          <span className="font-medium text-purple-900">AI Assistant</span>
        </Link>
      </div>
    </div>
  );
}
