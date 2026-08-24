import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardStats from '../../components/DashboardStats';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getEmployeeDashboard } from '../../services/dashboardService';
import toast from 'react-hot-toast';

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeDashboard();
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'My Events', value: data?.totalEvents || 0, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Registrations', value: data?.totalRegistrations || 0, icon: Users, color: 'bg-green-500' },
    { label: 'Upcoming Events', value: data?.upcomingEvents?.length || 0, icon: Clock, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your overview.</p>
        </div>
        <Link
          to="/employee/events"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View My Events
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <DashboardStats key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Assigned Events</h2>
            <Link to="/employee/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.assignedEvents?.length > 0 ? (
              data.assignedEvents.map((event) => (
                <div key={event._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} · {event.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No events assigned yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Registrations</h2>
          </div>
          <div className="space-y-3">
            {data?.recentRegistrations?.length > 0 ? (
              data.recentRegistrations.map((reg) => (
                <div key={reg._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={reg.client?.image || `https://ui-avatars.com/api/?name=${reg.client?.name}&background=random`}
                    alt={reg.client?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{reg.client?.name}</p>
                    <p className="text-sm text-gray-500">registered for {reg.event?.title}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    reg.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {reg.status === 'confirmed' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {reg.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No recent registrations</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/employee/events"
          className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <Calendar className="text-blue-600" size={20} />
          <span className="font-medium text-blue-900">Manage My Events</span>
        </Link>
        <Link
          to="/employee/registrations"
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors"
        >
          <Users className="text-green-600" size={20} />
          <span className="font-medium text-green-900">View Registrations</span>
        </Link>
      </div>
    </div>
  );
}
