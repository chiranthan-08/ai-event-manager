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
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'My Bookings', value: data?.totalBookings || 0, icon: Ticket, color: 'bg-blue-500' },
    { label: 'Upcoming Events', value: data?.upcomingEvents?.length || 0, icon: Calendar, color: 'bg-green-500' },
    { label: 'Total Spent', value: `$${(data?.totalSpent || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Manage your bookings and events.</p>
        </div>
        <Link
          to="/client/events"
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
            {data?.upcomingEvents?.length > 0 ? (
              data.upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img src={event.image} alt={event.title} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} · {event.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${event.price}</p>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{event.category}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-300 mb-2" size={40} />
                <p className="text-gray-400">No upcoming events</p>
                <Link to="/client/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">Browse Events</Link>
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
            {data?.recentBookings?.length > 0 ? (
              data.recentBookings.map((booking) => (
                <div key={booking._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm truncate">{booking.event?.title}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ticket: {booking.ticketId}</p>
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
          to="/client/events"
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
