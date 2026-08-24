import { Award, Calendar, Briefcase, Star } from 'lucide-react';

export default function EmployeeCard({ employee, onClick }) {
  return (
    <div
      onClick={() => onClick?.(employee)}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600">
        <img
          src={employee.profileImage || employee.avatar || '/placeholder-avatar.jpg'}
          alt={employee.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white">{employee.name}</h3>
          <p className="text-white/80 text-sm capitalize">{employee.role}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {employee.specialization && (
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="w-4 h-4 text-violet-500" />
            <span className="text-sm">{employee.specialization}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Experience</p>
              <p className="text-sm font-medium">{employee.experience || 0} years</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Events</p>
              <p className="text-sm font-medium">{employee.eventsManaged || 0}</p>
            </div>
          </div>
        </div>

        {employee.rating && (
          <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(employee.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">{employee.rating.toFixed(1)}</span>
          </div>
        )}

        <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors group-hover:bg-violet-600 group-hover:text-white">
          View Profile
        </button>
      </div>
    </div>
  );
}
