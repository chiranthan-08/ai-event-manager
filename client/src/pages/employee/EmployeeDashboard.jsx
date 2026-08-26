import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  ArrowUpRight,
  CheckCircle,
  User,
  Mail,
  Briefcase,
  CalendarCheck,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getOrganizerDashboard } from '../../services/organizerService';

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrganizerDashboard();
      setData(response.data.dashboard || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Events', value: data?.totalEvents || 0, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Today Events', value: data?.todaySlotsUsed || 0, icon: CalendarCheck, color: 'bg-green-500' },
    { label: 'Upcoming Events', value: data?.upcomingEvents?.length || 0, icon: Clock, color: 'bg-purple-500' },
    { label: 'Completed', value: data?.completedEvents || 0, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Total Attendees', value: data?.totalRegisteredAttendees || 0, icon: Users, color: 'bg-amber-500' },
    { label: 'Waiting List', value: data?.waitingListCount || 0, icon: UserCheck, color: 'bg-rose-500' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {data?.name || 'Organizer'}!</p>
        </div>
        <Link
          to="/employee/events"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          View My Events
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{data?.name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-emerald-100">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> {data?.email}
              </span>
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full font-mono font-bold">
                <Briefcase className="w-4 h-4" /> {data?.organizerId}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-emerald-100">Today's Slots</div>
            <div className="text-3xl font-bold">
              {data?.todaySlotsUsed || 0}/{data?.todaySlotsUsed !== undefined ? 3 : '\u2014'}
            </div>
            <div className="text-xs text-emerald-200 mt-1">
              {data?.todaySlotsAvailable > 0
                ? `${data.todaySlotsAvailable} slot${data.todaySlotsAvailable !== 1 ? 's' : ''} available`
                : data?.todaySlotsUsed !== undefined
                  ? 'Fully Booked'
                  : 'No events today'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/employee/events" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.upcomingEvents?.length > 0 ? (
              data.upcomingEvents.slice(0, 5).map((event) => (
                <div key={event._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' \u00B7 '}{event.venue}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    event.status === 'active' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Clients</h2>
            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-medium">
              {data?.waitingListCount || 0} waiting
            </span>
          </div>
          <div className="space-y-3">
            {data?.pendingClients?.length > 0 ? (
              data.pendingClients.map((entry) => (
                <div key={entry._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={`https://ui-avatars.com/api/?name=${entry.client?.name}&background=random`}
                    alt={entry.client?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{entry.client?.name}</p>
                    <p className="text-sm text-gray-500">Waiting since {new Date(entry.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                    #{entry.position}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No pending clients</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/employee/events"
          className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors"
        >
          <Calendar className="text-emerald-600" size={20} />
          <span className="font-medium text-emerald-900">Manage My Events</span>
        </Link>
        <Link
          to="/employee/ai-assistant"
          className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <span className="font-medium text-purple-900">AI Assistant</span>
        </Link>
      </div>
    </div>
  );
}
