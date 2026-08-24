import { Calendar, Clock, MapPin, Download, Printer, QrCode } from 'lucide-react';

export default function TicketCard({ ticket }) {
  const statusColors = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex">
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{ticket.eventName || ticket.event?.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Ticket #{ticket.ticketId || ticket._id?.slice(-8)}</p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                statusColors[ticket.status] || statusColors.pending
              }`}
            >
              {ticket.status || 'Pending'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{new Date(ticket.date || ticket.event?.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{ticket.time || ticket.event?.time || '7:00 PM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="line-clamp-1">{ticket.venue || ticket.event?.venue}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Attendee</span>
              <span className="font-medium text-gray-900">{ticket.clientName || ticket.client?.name || 'N/A'}</span>
            </div>
            {ticket.quantity && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium text-gray-900">{ticket.quantity}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-px bg-gray-200 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-gray-50 rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-gray-50 rounded-full" />
        </div>

        <div className="w-44 p-5 flex flex-col items-center justify-center bg-gray-50/50">
          <div className="w-28 h-28 bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
            <div className="text-center">
              <QrCode className="w-10 h-10 text-gray-300 mx-auto mb-1" />
              <p className="text-[10px] text-gray-400 font-mono">{ticket.ticketId || ticket._id?.slice(-8)}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors" title="Download">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors" title="Print">
              <Printer className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
