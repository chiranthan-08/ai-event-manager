import { useState, useEffect } from 'react';
import { Search, Eye, Mail, Calendar, DollarSign, Users } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getClients, getClientDetails } from '../../services/clientService';
import toast from 'react-hot-toast';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data.users || response.data.clients || response.data);
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const viewClientDetails = async (client) => {
    try {
      setLoadingDetails(true);
      setSelectedClient(client);
      const response = await getClientDetails(client._id);
      setClientDetails(response.data);
    } catch (error) {
      toast.error('Failed to load client details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Client Management</h1>
        <p className="text-gray-500 mt-1">View and manage registered clients</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
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
              <p className="text-2xl font-bold text-gray-900">${clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Calendar className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clients.reduce((sum, c) => sum + (c.registrationCount || 0), 0)}</p>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredClients.length === 0 ? (
        <EmptyState message="No clients found" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3 text-right">Registrations</th>
                  <th className="px-6 py-3 text-right">Total Spent</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={client.image || `https://ui-avatars.com/api/?name=${client.name}&background=random`}
                          alt={client.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{client.registrationCount || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">${(client.totalSpent || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(client.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => viewClientDetails(client)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClient && (
        <Modal onClose={() => { setSelectedClient(null); setClientDetails(null); }} title={`Client Details - ${selectedClient.name}`}>
          <div className="p-6">
            {loadingDetails ? (
              <LoadingSpinner />
            ) : clientDetails ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedClient.image || `https://ui-avatars.com/api/?name=${selectedClient.name}&background=random`}
                    alt={selectedClient.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h3>
                    <p className="text-gray-500 flex items-center gap-1"><Mail size={14} /> {selectedClient.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{clientDetails.registrations?.length || 0}</p>
                    <p className="text-sm text-gray-500">Bookings</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">${(clientDetails.totalSpent || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{clientDetails.payments?.length || 0}</p>
                    <p className="text-sm text-gray-500">Payments</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Registrations</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {clientDetails.registrations?.length > 0 ? (
                      clientDetails.registrations.map((reg) => (
                        <div key={reg._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{reg.event?.title}</p>
                            <p className="text-sm text-gray-500">{new Date(reg.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reg.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {reg.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-2">No registrations</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {clientDetails.payments?.length > 0 ? (
                      clientDetails.payments.map((payment) => (
                        <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{payment.event?.title}</p>
                            <p className="text-sm text-gray-500">{payment.paymentId}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${payment.amount}</p>
                            <span className={`text-xs font-medium ${
                              payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>{payment.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-2">No payments</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex justify-end mt-6">
              <button onClick={() => { setSelectedClient(null); setClientDetails(null); }} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
