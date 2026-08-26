import { useState, useEffect } from 'react';
import { Download, Printer, Ticket, Calendar, Clock, MapPin, Search } from 'lucide-react';
import TicketCard from '../../components/TicketCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { getMyRegistrations } from '../../services/registrationService';
import toast from 'react-hot-toast';

export default function ClientTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getMyRegistrations();
      setTickets(response.data.registrations || response.data.tickets || []);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    !statusFilter || ticket.status === statusFilter
  );

  const handleDownload = (ticket) => {
    const ticketContent = `
EVENT TICKET
============
Ticket ID: ${ticket.ticketId}
Event: ${ticket.event?.title}
Date: ${new Date(ticket.event?.date).toLocaleDateString()}
Time: ${ticket.event?.time}
Location: ${ticket.event?.location}
Attendee: ${ticket.client?.name}
Status: ${ticket.status}
Price: $${ticket.event?.price}
============
Present this ticket at the venue entrance.
    `.trim();

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.ticketId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Ticket downloaded');
  };

  const handlePrint = (ticket) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${ticket.ticketId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .ticket { border: 2px solid #333; border-radius: 12px; padding: 30px; max-width: 500px; margin: 0 auto; }
            .header { border-bottom: 2px dashed #ccc; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .detail-item { }
            .label { font-size: 12px; color: #666; text-transform: uppercase; }
            .value { font-size: 16px; font-weight: 500; }
            .footer { border-top: 2px dashed #ccc; padding-top: 20px; margin-top: 20px; text-align: center; color: #666; }
            .barcode { font-family: monospace; font-size: 18px; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="title">${ticket.event?.title}</div>
              <div class="barcode">${ticket.ticketId}</div>
            </div>
            <div class="details">
              <div class="detail-item">
                <div class="label">Date</div>
                <div class="value">${new Date(ticket.event?.date).toLocaleDateString()}</div>
              </div>
              <div class="detail-item">
                <div class="label">Time</div>
                <div class="value">${ticket.event?.time}</div>
              </div>
              <div class="detail-item">
                <div class="label">Location</div>
                <div class="value">${ticket.event?.location}</div>
              </div>
              <div class="detail-item">
                <div class="label">Attendee</div>
                <div class="value">${ticket.client?.name}</div>
              </div>
            </div>
            <div class="footer">
              <p>Present this ticket at the venue entrance</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-500 mt-1">View and download your event tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <Ticket className="text-blue-600" size={20} />
          <span className="text-sm font-medium text-gray-600">{tickets.length} tickets</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredTickets.length === 0 ? (
        <EmptyState message="No tickets found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">EVENT TICKET</span>
                  <span className="text-xs font-mono opacity-75">{ticket.ticketId}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{ticket.event?.title}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{new Date(ticket.event?.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span>{ticket.event?.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{ticket.event?.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {ticket.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">${ticket.event?.price}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(ticket)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    onClick={() => handlePrint(ticket)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Printer size={14} />
                    Print
                  </button>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Attendee: {ticket.client?.name}</span>
                  <span>Verify at venue</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
