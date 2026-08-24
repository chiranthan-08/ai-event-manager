import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, Tag } from 'lucide-react';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event._id || event.id}`);
  };

  const availableSeats = event.capacity - (event.bookedSeats || 0);
  const seatsPercentage = (availableSeats / event.capacity) * 100;

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.image || event.images?.[0] || '/placeholder-event.jpg'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {event.category && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
            <Tag className="w-3 h-3" />
            {event.category}
          </span>
        )}

        {event.ticketPrice !== undefined && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
            ${event.ticketPrice}
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-3 text-white/80 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.date).toLocaleDateString()}
            </span>
            {event.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {event.time}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="text-sm line-clamp-1">{event.venue || 'Venue TBA'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span className="text-sm">{availableSeats} seats left</span>
          </div>
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                seatsPercentage > 50
                  ? 'bg-emerald-500'
                  : seatsPercentage > 20
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${seatsPercentage}%` }}
            />
          </div>
        </div>

        <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors group-hover:bg-violet-600 group-hover:text-white">
          View Details
        </button>
      </div>
    </div>
  );
}
