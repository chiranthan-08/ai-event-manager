import { useState, useEffect, useMemo } from 'react';
import { Search, Users, Eye, X, Mail, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getOrganizerClients } from '../../services/organizerService';
import toast from 'react-hot-toast';

export default function OrganizerClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrganizerClients();
      setClients(response.data.clients || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    if (!localSearch) return clients;
    const q = localSearch.toLowerCase();
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.events?.some((e) => e.title?.toLowerCase().includes(q))
    );
  }, [clients, localSearch]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-500 mt-1">Clients who have bookings with your events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Users className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              <p className="text-sm text-gray-500">Total Clients</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="text-green-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{'\u20B9'}{clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Users className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clients.reduce((sum, c) => sum + (c.totalBookings || 0), 0)}</p>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 mb-3">{error}</p>
          <button onClick={fetchClients} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        <EmptyState message="No clients found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div key={client._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={client.profileImage || `https://ui-avatars.com/api/?name=${client.name}&background=random`}
                  alt={client.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{client.name}</p>
                  <p className="text-sm text-gray-500 truncate">{client.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-gray-900">{client.totalBookings || 0}</p>
                  <p className="text-xs text-gray-500">Bookings</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-emerald-600">{'\u20B9'}{(client.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Spent</p>
                </div>
              </div>
              {client.events?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Events</p>
                  {client.events.slice(0, 3).map((evt, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span className="truncate font-medium text-gray-700">{evt.title}</span>
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                        evt.status === 'active' ? 'bg-green-100 text-green-700' :
                        evt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{evt.status}</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setSelectedClient(client)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <Eye size={14} /> View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Client Details</h3>
              <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedClient.profileImage || `https://ui-avatars.com/api/?name=${selectedClient.name}&background=random`}
                  alt={selectedClient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h4>
                  <p className="text-gray-500 flex items-center gap-1"><Mail size={14} /> {selectedClient.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedClient.totalBookings}</p>
                  <p className="text-sm text-gray-500">Bookings</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{'\u20B9'}{(selectedClient.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
              </div>
              {selectedClient.events?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Associated Events</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedClient.events.map((evt, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{evt.title}</p>
                          <p className="text-sm text-gray-500">{new Date(evt.date).toLocaleDateString()} · {evt.venue}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          evt.status === 'active' ? 'bg-green-100 text-green-700' :
                          evt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{evt.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end pt-2">
                <button onClick={() => setSelectedClient(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
